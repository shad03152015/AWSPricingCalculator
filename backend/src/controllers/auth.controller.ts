import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt.utils';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          error: 'Email, password, and name are required',
        });
        return;
      }

      // Validate password strength
      if (password.length < 8) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long',
        });
        return;
      }

      if (!/[A-Z]/.test(password)) {
        res.status(400).json({
          success: false,
          error: 'Password must contain at least one uppercase letter',
        });
        return;
      }

      if (!/[0-9]/.test(password)) {
        res.status(400).json({
          success: false,
          error: 'Password must contain at least one number',
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists',
        });
        return;
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        name,
      });

      await user.save();

      // Generate JWT token
      const token = generateToken(user._id.toString());

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register user',
      });
    }
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Generate JWT token
      const token = generateToken(user._id.toString());

      res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login',
      });
    }
  }

  // Get current user profile
  static async getProfile(req: Request & { userId?: string }, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.userId).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile',
      });
    }
  }

  // Update user profile
  static async updateProfile(req: Request & { userId?: string }, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name || name.trim().length < 2) {
        res.status(400).json({
          success: false,
          error: 'Name must be at least 2 characters long',
        });
        return;
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        { name: name.trim() },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
      });
    }
  }
}
