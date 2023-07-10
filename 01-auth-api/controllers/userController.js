import bcrypt from 'bcrypt';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

function generateAccessToken(userId) {
  const ttl = process.env.ACCESS_TOKEN_TTL;
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: ttl,
  });
  return accessToken;
}

function generateRefreshToken(userId) {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET);
  return refreshToken;
}

export const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    } else if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    } else if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password too short' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const checkQuery = 'SELECT * FROM users WHERE email = $1';
    const checkValues = [email];
    const existingUser = await db.query(checkQuery, checkValues);

    if (existingUser.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id';
    const insertValues = [email, hashedPassword];
    const result = await db.query(insertQuery, insertValues);
    const userId = result[0].id;
    const accessToken = generateAccessToken(userId);
    console.log('Access Token:', accessToken);
    const refreshToken = generateRefreshToken(userId);
    res.status(201).json({
      success: true,
      data: {
        id: userId,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during sign up' });
  }
};

export const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    } else if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    const checkQuery = 'SELECT * FROM users WHERE email = $1';
    const checkValues = [email];
    const existingUser = await db.query(checkQuery, checkValues);

    const match = await bcrypt.compare(password, existingUser[0].password);

    if (!existingUser || existingUser.length === 0 || !match) {
      return res.status(404).json({ success: false, error: 'Email or password are incorrect' });
    }
    const userId = existingUser[0].id;
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    res.status(200).json({
      success: true,
      data: {
        id: userId,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during sign-in' });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid or missing authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


export const getUserData = async (req, res) => {
  try {
    const userQuery = 'SELECT id, email FROM users WHERE id = $1';
    const userValues = [req.userId];
    const user = await db.query(userQuery, userValues);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving user data' });
  }
};
