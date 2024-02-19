import { NextApiRequest, NextApiResponse } from 'next';
import CommentaryModel from '@/lib/models/Commentary';
import { connectToDatabase } from '@/lib/mongo/connect';

connectToDatabase();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { commentaryId } = req.query;

  try {
    const deletedCommentary = await CommentaryModel.findByIdAndDelete(commentaryId);

    if (!deletedCommentary) {
      return res.status(404).json({ error: 'Commentary not found' });
    }

    return res.status(200).json({ message: 'Commentary deleted successfully' });
  } catch (error) {
    console.error('Error deleting commentary:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}