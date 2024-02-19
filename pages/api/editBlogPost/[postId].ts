import { NextApiRequest, NextApiResponse } from 'next';
import BlogPostModel, { IBlogPost } from '@/lib/models/BlogPost';
import { connectToDatabase } from '@/lib/mongo/connect';

connectToDatabase();

interface ErrorResponse {
  error: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IBlogPost | ErrorResponse>) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { postId, updatedFields } = req.body;

  try {
    const updatedPost = await BlogPostModel.findByIdAndUpdate(postId, updatedFields, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}