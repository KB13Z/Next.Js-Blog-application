import { connectToDatabase } from '@/lib/mongo/connect'
import { NextApiRequest, NextApiResponse } from 'next'
import BlogPostModel, { IBlogPost } from '@/lib/models/BlogPost'
import TagModel from '@/lib/models/Tag'

connectToDatabase();

interface ErrorResponse {
    error: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IBlogPost | ErrorResponse>) {
  if (req.method === 'POST') {
    try {
      const { title, description, selectedImageOption, selectedOption, createdAt } = req.body;

      const existingTag = await TagModel.findOne({ name: selectedOption });

      if (!existingTag) {
        const newTag = new TagModel({ name: selectedOption });
        await newTag.save();
      }

      const newBlogPost = new BlogPostModel({
        image: selectedImageOption.imageUrl,
        title,
        description,
        tag: selectedOption,
        createdAt,
        tags: [selectedOption],
      });

      const savedPost = await newBlogPost.save();

      res.status(201).json(savedPost);
    } catch (error) {
      console.error('Error saving blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}