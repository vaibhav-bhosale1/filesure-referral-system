import { Request, Response } from 'express';
import User from '../models/user.model';
import Referral from '../models/referral.model';

// @desc    Get data for the user's dashboard
// @route   GET /api/dashboard
// @access  Private (Requires auth)
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // req.user is attached by the 'protect' middleware
    const userId = req.user?._id;

    // 1. Get the user's own data (credits and referral code)
    const user = await User.findById(userId).select('credits referralCode');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Get Total Referred Users [cite: 40]
    const totalReferredUsers = await Referral.countDocuments({
      referrer: userId,
    });

    // 3. Get Number of Converted Users [cite: 41]
    const convertedUsers = await Referral.countDocuments({
      referrer: userId,
      status: 'converted',
    });
    
    // 4. Total Credits Earned is directly from the user model [cite: 42]
    const totalCreditsEarned = user.credits;
    
    // 5. Get the unique referral link [cite: 43]
    const referralLink = `https://filesure-referral-system-zeta.vercel.app/register?r=${user.referralCode}`; // [cite: 16]

    res.status(200).json({
      totalReferredUsers,
      convertedUsers,
      totalCreditsEarned,
      referralCode: user.referralCode,
      referralLink,
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};