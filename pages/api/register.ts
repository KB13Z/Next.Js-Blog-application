import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongo/connect';
import UserModel from '@/lib/models/User';
import bcrypt from 'bcrypt';

connectToDatabase();

const saltRounds = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }