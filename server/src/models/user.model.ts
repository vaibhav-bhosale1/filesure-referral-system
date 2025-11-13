import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto'; // To generate the referral code

// Interface for TypeScript, ensuring type safety
export interface IUser extends Document {
  email: string;
  passwordHash: string; // We will never store plaintext passwords [cite: 28]
  referralCode: string;  // Unique code for each user [cite: 30]
  credits: number;
  referredBy: mongoose.Schema.Types.ObjectId | null; // Who referred this user
  hasMadeFirstPurchase: boolean; // Crucial for the "first purchase only" rule 
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(6).toString('hex').toUpperCase(), // Auto-generates a code like 'LINA123' [cite: 16]
  },
  credits: {
    type: Number,
    default: 0,
  },
  // This field establishes the link when a user signs up via referral [cite: 32]
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  hasMadeFirstPurchase: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>('User', UserSchema);