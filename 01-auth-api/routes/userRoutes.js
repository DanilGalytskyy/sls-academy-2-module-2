import express from 'express';
import {userRegister} from '../controllers/userController.js';
import {getUserData} from '../controllers/userController.js';
import { userSignIn } from '../controllers/userController.js';
import { authenticateToken } from '../controllers/userController.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post('/auth/sign-up', userRegister);
router.post('/auth/sign-in', userSignIn);
router.get('/me', authenticateToken, getUserData);

export default router;
