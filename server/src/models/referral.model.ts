import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referrer: mongoose.Schema.Types.ObjectId; // The user who owns the link (Lina)
  referredUser: mongoose.Schema.Types.ObjectId; // The user who signed up (Ryan)
  status: 'pending' | 'converted'; // Tracks if the referred user has purchased 
  createdAt: Date;
}

const ReferralSchema: Schema = new Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures one user can only be referred once
  },
  status: {
    type: String,
    enum: ['pending', 'converted'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IReferral>('Referral', ReferralSchema);