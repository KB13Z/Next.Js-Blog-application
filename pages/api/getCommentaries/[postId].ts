import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongo/connect';
import CommentaryModel from '@/lib/models/Commentary';

connectToDatabase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { postId, page = 1, limit = 5 } = req.query;

    try {
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const commentaries = await CommentaryModel.find({ postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string));

      const totalCount = await CommentaryModel.countDocuments({ postId });

      if (commentaries.length === 0) {
        return res.status(200).json([]);
      }

      res.setHeader('x-total-count', totalCount.toString());
      res.status(200).json(commentaries);
    } catch (error) {
      console.error('Error fetching commentaries:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}