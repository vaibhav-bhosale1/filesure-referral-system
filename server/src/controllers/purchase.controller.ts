import { Request, Response } from 'express';
import User from '../models/user.model';
import Referral from '../models/referral.model';
import mongoose from 'mongoose';

// @desc    Simulate a user's first purchase
// @route   POST /api/purchase
// @access  Private (Requires auth)
export const simulatePurchase = async (req: Request, res: Response) => {
  // We get the user from the 'protect' middleware
  const userId = req.user?._id;

  // Use a database session and transaction for data integrity [cite: 45, 47]
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Get the user making the purchase
    const purchasingUser = await User.findById(userId).session(session);

    if (!purchasingUser) {
      throw new Error('User not found.');
    }

    // 2. Check if this is their first purchase and if they were referred
    if (
      !purchasingUser.hasMadeFirstPurchase &&
      purchasingUser.referredBy
    ) {
      // 3. Find the associated referral document
      const referral = await Referral.findOne({
        referredUser: purchasingUser._id,
        referrer: purchasingUser.referredBy,
      }).session(session);

      if (!referral) {
        // This case shouldn't happen if registration worked, but it's good to check
        throw new Error('Referral record not found.');
      }

      // 4. Check if referral is still 'pending' to prevent double-crediting
      if (referral.status === 'pending') {
        const referrerId = purchasingUser.referredBy;

        // 5. Award credits to both users [cite: 34]
        // Award 2 credits to the referrer (Lina)
        await User.findByIdAndUpdate(
          referrerId,
          { $inc: { credits: 2 } },
          { session }
        );

        // Award 2 credits to the referred user (Ryan)
        purchasingUser.credits += 2;
        
        // 6. Update statuses to prevent future credits for this pair
        purchasingUser.hasMadeFirstPurchase = true; 
        referral.status = 'converted'; 

        await purchasingUser.save({ session });
        await referral.save({ session });
        
        // 7. Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
          message: 'Purchase successful! Referral credits awarded to you and your referrer.',
          credits: purchasingUser.credits,
        });
      }
    }

    // If it's not their first purchase, or they weren't referred
    // just mark the purchase as done (if it wasn't already).
    if (!purchasingUser.hasMadeFirstPurchase) {
      purchasingUser.hasMadeFirstPurchase = true;
      await purchasingUser.save({ session });
    }
    
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: 'Purchase successful. No referral credits awarded this time.',
      credits: purchasingUser.credits,
    });

  } catch (error) {
    // If anything fails, abort the transaction
    await session.abortTransaction();
    session.endSession();
    
    console.error('Purchase simulation failed:', error);
    res.status(500).json({ message: 'Server error during purchase simulation' });
  }
};