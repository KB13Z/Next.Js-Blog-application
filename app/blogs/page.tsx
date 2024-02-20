import { Suspense } from 'react';
import Blogs from './blogs';

const BlogsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Blogs />
  </Suspense>
);

export default BlogsPage;