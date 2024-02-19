import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongo/connect';
import CommentaryModel from '@/lib/models/Commentary';

connectToDatabase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { postId, author, text } = req.body;

    console.log('Request Object:', req);

    try {
      const newCommentary = new CommentaryModel({
        postId,
        author,
        text,
      });

      await newCommentary.save();

      res.status(201).json({
        message: 'Commentary added successfully',
        commentary: newCommentary.toJSON()
      });
    } catch (error) {
      console.error('Error adding commentary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}