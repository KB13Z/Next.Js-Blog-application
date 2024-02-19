import { connectToDatabase } from '@/lib/mongo/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import BlogPostModel, { IBlogPost } from '@/lib/models/BlogPost';

connectToDatabase();

interface ErrorResponse {
  error: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IBlogPost | ErrorResponse>) {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { postId } = req.query;
  
    try {
        const deletedPost = await BlogPostModel.findByIdAndDelete(postId as string);
    
        if (!deletedPost) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
  
        return res.status(200).json({ error: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }