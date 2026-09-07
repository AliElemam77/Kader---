import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types/auth.types';

export class AuthController {
  // Step 1: Request Passwordless Login (Dispatches Hybrid OTP + Magic Link)
  static async requestAccess(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        sendError(res, 'A valid email address is required', 400);
        return;
      }

      const result = await AuthService.requestAccess(email);
      sendSuccess(res, result, 'Verification code dispatched');
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  // Step 2A: Verify 6-digit OTP code
  static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        sendError(res, 'Both email and verification code are required', 400);
        return;
      }

      const result = await AuthService.verifyOtp(email, code);
      sendSuccess(res, result, 'Authentication successful');
    } catch (error) {
      sendError(res, (error as Error).message, 401);
    }
  }

  // Step 2B: Verify 1-Click Magic Link Token
  static async verifyMagicLink(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        sendError(res, 'Login token is required', 400);
        return;
      }

      const result = await AuthService.verifyMagicLink(token);
      sendSuccess(res, result, 'Magic link verified successfully');
    } catch (error) {
      sendError(res, (error as Error).message, 401);
    }
  }

  // Get current authenticated user profile
  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      sendSuccess(res, req.user, 'User profile fetched');
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }
}
