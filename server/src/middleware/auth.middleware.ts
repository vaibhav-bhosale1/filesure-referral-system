import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';


declare global {
  namespace Express {
    interface Request {
      user?: IUser; // We'll attach the full user object
    }
  }
}

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET not found. Server configuration error.');
      }
      
      const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

    
      const user = await User.findById(decoded.userId).select('-passwordHash');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user; // Attach user to the request object
      next(); // Move to the next middleware or controller
    
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};