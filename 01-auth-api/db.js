import pg from 'pg';
import { config } from 'dotenv';

config();
const { Pool } = pg;

const pool = new Pool();

const query = async (queryString, values = []) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queryString, values);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

export default {
  query,
};
