import { connectToDatabase } from '@/lib/mongo/connect';
import TagModel from '@/lib/models/Tag';
import { NextApiRequest, NextApiResponse } from 'next'

connectToDatabase();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
    if (req.method === 'POST') {
      try {
        const { value } = req.body;
        const existingTag = await TagModel.findOne({ value });
  
        if (existingTag) {
          res.status(400).json({ error: 'Tag already exists' });
          return;
        }
  
        const newTag = new TagModel({ value });
        await newTag.save();
  
        res.status(201).json(newTag);
      } catch (error) {
        console.error('Error saving tag:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }