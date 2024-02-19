import { connectToDatabase } from '@/lib/mongo/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import BlogPostModel, { IBlogPost } from '@/lib/models/BlogPost';

connectToDatabase();

interface ErrorResponse {
  error: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IBlogPost[] | ErrorResponse>) {
  if (req.method === 'GET') {
    const { page = 1, pageSize = 6, tag } = req.query;
    
    try {
      let query = {};

      if (tag) {
        query = { tag: { $regex: new RegExp(tag.toString(), 'i') } };
      }

      if (!tag) {
        query = {};
      }

      const totalPosts = await BlogPostModel.countDocuments(query);

      const blogPosts = await BlogPostModel.find(query)
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .sort({ createdAt: -1 });

      const totalPages = Math.ceil(totalPosts / Number(pageSize));

      res.setHeader('x-total-pages', totalPages.toString());
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}