import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple in-memory user store (for hackathon demo)
const users = [
  { email: 'ahmed@example.com', password: 'password123', customerId: 'C12345' },
  { email: 'ahmed.mansoori@example.com', password: 'demo123', customerId: 'C12345' },
  { email: 'fatima@example.com', password: 'password123', customerId: 'C67890' },
  { email: 'fatima.hassan@example.com', password: 'demo123', customerId: 'C67890' },
  { email: 'mohammed@example.com', password: 'password123', customerId: 'C11223' },
  { email: 'mohammed.hashimi@example.com', password: 'demo123', customerId: 'C11223' },
  { email: 'sara@example.com', password: 'password123', customerId: 'C44556' },
  { email: 'omar@example.com', password: 'password123', customerId: 'C77889' },
  { email: 'layla@example.com', password: 'password123', customerId: 'C99001' }
];

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { customerId: user.customerId, email: user.email },
      process.env.JWT_SECRET || 'dewa-hackathon-secret',
      { expiresIn: '24h' }
    );

    // Load customer data
    const customersData = await fs.readFile(
      path.join(__dirname, '../../data/customers.json'),
      'utf-8'
    );
    const customers = JSON.parse(customersData);
    const customer = customers.find(c => c.id === user.customerId);

    res.json({
      success: true,
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed'
    });
  }
});

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dewa-hackathon-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
};

export default router;
