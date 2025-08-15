import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { UserRole } from '@/types';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface PasswordResetToken {
  token: string;
  expiresAt: Date;
  userId: string;
}

export interface EmailVerificationToken {
  token: string;
  expiresAt: Date;
  userId: string;
}

// Token generation
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
  };
  return jwt.sign(payload, JWT_SECRET as Secret, options);
}

export function generatePasswordResetToken(userId: string): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateEmailVerificationToken(userId: string): string {
  return crypto.randomBytes(32).toString('hex');
}

// Token verification
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Token extraction
export function extractTokenFromHeader(authHeader: string): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header must start with Bearer');
  }
  
  return authHeader.substring(7);
}

// Request interfaces
export interface AuthenticatedRequest extends NextApiRequest {
  user?: JWTPayload;
}

export interface AuthenticatedNextRequest extends NextRequest {
  user?: JWTPayload;
}

// Middleware functions
export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authorization header is required' 
        });
      }

      const token = extractTokenFromHeader(authHeader);
      const decoded = verifyToken(token);
      
      req.user = decoded;
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      });
    }
  };
}

export function withRole(roles: UserRole[]) {
  return function(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
    return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not authenticated' 
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
      }

      return handler(req, res);
    });
  };
}

// Role-specific middleware
export function withAdmin(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return withRole([UserRole.ADMIN])(handler);
}

export function withProvider(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return withRole([UserRole.PROVIDER])(handler);
}

export function withCustomer(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return withRole([UserRole.CUSTOMER])(handler);
}

export function withOps(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return withRole([UserRole.OPS])(handler);
}

export function withFinance(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return withRole([UserRole.FINANCE])(handler);
}

// Session management
export function createSession(userId: string, email: string, role: UserRole) {
  const token = generateToken({ userId, email, role });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
  
  return {
    token,
    expiresAt,
    user: { userId, email, role }
  };
}

export function validateSession(token: string): JWTPayload | null {
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

// Password validation
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
