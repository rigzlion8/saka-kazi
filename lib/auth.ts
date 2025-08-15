import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

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

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function extractTokenFromHeader(authHeader: string): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header must start with Bearer');
  }
  
  return authHeader.substring(7);
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: JWTPayload;
}

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

export function withProviderOrCustomer(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return withRole([UserRole.PROVIDER, UserRole.CUSTOMER])(handler);
}

export function withStaff(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return withRole([UserRole.ADMIN, UserRole.OPS, UserRole.FINANCE])(handler);
}
