'use client'
import { useEffect, useState, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'
import styles from './blogs.module.css'

interface BlogPost {
    _id: string;
    title: string;
    description: string;
    image: string;
    tag: string;
    createdAt: string;
}

const Blogs: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchBlogPosts = useCallback(async (page: number, tag?: string) => {
    try {
      const response = await axios.get(`/api/getBlogPosts?page=${page}&tag=${tag || ''}`);
      setBlogPosts(response.data);
      setTotalPages(response.headers['x-total-pages']);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== 'undefined') {
        const tag = searchParams?.get('tag') ?? '';
        await fetchBlogPosts(currentPage, tag);
      } else {
        const tag = searchParams?.get('tag') ?? '';
        await fetchBlogPosts(currentPage, tag);
      }
    };

    fetchData();
  }, [pathname, searchParams, currentPage, fetchBlogPosts]);

  const handleTagClick = (tag: string) => {
    const lowerCaseTag = tag.toLowerCase();
    const tagRoute = `/blogs?tag=${lowerCaseTag}`;
    window.location.href = tagRoute;
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
            <div dangerouslySetInnerHTML={{ __html: post.description.length > 60 ? `${post.description.slice(0, 60)}...` : post.description}} className={styles.postDescription} />
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
