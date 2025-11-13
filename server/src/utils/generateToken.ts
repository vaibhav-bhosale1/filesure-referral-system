import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

/**
 * Generates a JSON Web Token for a user.
 * @param userId - The MongoDB ObjectId of the user.
 */
const generateToken = (userId: Types.ObjectId): string => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in .env file');
    process.exit(1); // Exit if secret is missing
  }

  // Create a token that expires in 30 days
  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: '30d',
  });
};

export default generateToken;