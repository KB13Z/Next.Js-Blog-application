'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'
import styles from './page.module.css'

interface BlogPost {
    _id: string;
    title: string;
    description: string;
    image: string;
    tag: string;
    createdAt: string;
}

const Blogs: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const fetchAllBlogPosts = useCallback(async () => {
    try {
      const response = await axios.get(`/api/getBlogPosts?page=${currentPage}`);
      setBlogPosts(response.data);
      setTotalPages(response.headers['x-total-pages']);
    } catch (error) {
      console.error('Error fetching all blog posts:', error);
    }
  }, [currentPage]);

  const fetchTagBlogPosts = useCallback(async () => {
    try {
      const response = await axios.get(`/api/getBlogPosts?page=${currentPage}&tag=${selectedTag}`);
      setBlogPosts(response.data);
      setTotalPages(response.headers['x-total-pages']);
    } catch (error) {
      console.error('Error fetching blog posts with tag:', error);
    }
  }, [currentPage, selectedTag]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { tag } = queryString.parse(window.location.search);
      setSelectedTag(tag as string || '');
    }
  }, []);

  useEffect(() => {
    if (pathname === '/blogs' && !searchParams?.get('tag')) {
      fetchAllBlogPosts();
    } else {
      const tag = searchParams?.get('tag') || '';
      setSelectedTag(tag);
      fetchTagBlogPosts();
    }
  }, [pathname, searchParams, fetchAllBlogPosts, fetchTagBlogPosts]);

  const handleTagClick = (tag: string) => {
    const lowerCaseTag = tag.toLowerCase();
    const tagRoute = `/blogs?tag=${lowerCaseTag}`;
    router.push(tagRoute);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }

  return (
    <section className={styles.blogsSection}>
      <div className={styles.blogsContainer}>
        {blogPosts.map((post) => (
          <div key={post._id} className={styles.blogPost}>
            {post.image && (
              <div>
                <Image
                  src={post.image}
                  alt={post.image}
                  width={350}
                  height={250}
                  className={styles.selectedImage}
                />
              </div>
            )}
            <Link href={`/blogs/${post._id}`} className={styles.blogPostLink}>
              <h3 className={styles.blogPostTitle}>
                {post.title}
              </h3>
            </Link><br />
            <div dangerouslySetInnerHTML={{ __html: post.description.length > 60 ? `${post.description.slice(0, 60)}...` : post.description}} />
            <br /><br />
            <div className={styles.tagDateWrapper}>
              <div className={styles.tagWrapper}>
                <p className={styles.blogPostTag} onClick={() => handleTagClick(post.tag)}>{post.tag}</p><br />
              </div>
              <p className={styles.blogPostDate}>Created at: {new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        {currentPage > 1 && (
          <button onClick={handlePrevPage} className={styles.paginationButton}>
            Previous
          </button>
        )}
        <p>Page {currentPage} of {totalPages}</p>
        {currentPage < totalPages && (
          <button onClick={handleNextPage} className={styles.paginationButton}>
            Next
          </button>
        )}
      </div>
    </section>
  );
};

export default Blogs;
