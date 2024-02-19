import { connectToDatabase } from '@/lib/mongo/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import BlogPostModel, { IBlogPost } from '@/lib/models/BlogPost';

connectToDatabase();

interface ErrorResponse {
  error: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IBlogPost | ErrorResponse>) {
  const { postId } = req.query;

  if (req.method === 'GET') {
    try {
      const blogPost = await BlogPostModel.findById(postId as string);

      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      res.status(200).json(blogPost);
    } catch (error) {
      console.error('Error fetching individual blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}