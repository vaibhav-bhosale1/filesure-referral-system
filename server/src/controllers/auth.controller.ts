import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import Referral from '../models/referral.model';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, referralCode } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 3. Find referrer if a referral code was used
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Create the new user
    const newUser = new User({
      email: email.toLowerCase(),
      passwordHash,
      // If a referrer was found, link this new user to them
      referredBy: referrer ? referrer._id : null,
    });
    await newUser.save();

    // 6. If referred, create the 'pending' referral link
    if (referrer) {
      const newReferral = new Referral({
        referrer: referrer._id,
        referredUser: newUser._id,
        status: 'pending', // Status is pending until first purchase
      });
      await newReferral.save();
    }
    
    // 7. Generate a token and send response
    const token = generateToken(newUser._id);
    
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      credits: newUser.credits,
      referralCode: newUser.referralCode,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


// @desc    Authenticate (login) a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Generate a token and send response
    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      credits: user.credits,
      referralCode: user.referralCode,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};