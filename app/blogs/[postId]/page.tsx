'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CommentaryList from '@/app/Components/CommentaryList/CommentaryList';
import TextEditor from '@/app/Components/TextEditor/TextEditor'
import styles from './page.module.css'

interface ImageOption {
  value: string;
  label: string;
  imageUrl: string;
}

const IndividualBlogPost = ({ params }: { params: { postId: string } }) => {
  const postId = params.postId;
  const { data: session } = useSession();
  const router = useRouter();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [editedPost, setEditedPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tagsList, setTagsList] = useState<string[]>([]);

  const imageOptions: ImageOption[] = [
    { value: '1', label: 'DIY', imageUrl: '/DIY.jpg' },
    { value: '2', label: 'Pets', imageUrl: '/Pets.jpg' },
    { value: '3', label: 'Travel', imageUrl: '/Travel.jpg' },
    { value: '4', label: 'Recipe', imageUrl: '/Recipe.jpg' },
    { value: '5', label: 'Inspiration', imageUrl: '/Inspiration.jpg' },
  ];

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        if (postId) {
          const response = await axios.get(`/api/getBlogPost/${postId}`);
          setEditedPost(response.data);
        } else {
          console.error('postId is undefined or null');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };

    fetchBlogPost();

    setTagsList([
      'DIY',
      'Pets',
      'Travel',
      'Recipe',
      'Inspiration',
    ]);
  }, [postId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setShowDeleteConfirmation(false);

    try {
      if (!postId) {
        console.error('postId is undefined or null');
        return;
      }

      await axios.delete(`/api/deleteBlogPost/${postId}`, { data: { postId } });

      setDeleteMessage('Post deleted successfully! Redirecting to all blog posts in 3 seconds.');

      setTimeout(() => {
        router.push('/blogs');
      }, 3000);
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(`/api/editBlogPost/${postId}`, {
        postId: postId,
        updatedFields: editedPost
      });
      setEditedPost(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  if (deleteMessage) {
    return (
      <div className={styles.deleteMessage}>
        <p>{deleteMessage}</p>
      </div>
    );
  }

  if (editedPost === null) {
    return <p>Loading...</p>;
  }

  const { image, title, description, tag, createdAt } = editedPost;

  return (
    <>
      {deleteMessage && (
        <div className={styles.deleteMessage}>
          <p>{deleteMessage}</p>
        </div>
      )}
      {isEditing ? (
        <div>
          <form onSubmit={handleSubmitEdit} className={styles.editingForm}>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Edit title:</label>
              <input 
                type="text" 
                className={styles.input}
                value={editedPost.title} 
                onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })} 
              />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Edit description:</label>
              <TextEditor 
                description={editedPost.description}
                value={editedPost.description} 
                onChange={(newDescription: string) => setEditedPost({ ...editedPost, description: newDescription })}  
              />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Change image:</label>
              <select
                value={editedPost.image}
                onChange={(e) => setEditedPost({ ...editedPost, image: e.target.value })}
                className={styles.selection}
              >
                <option value="">Select image</option>
                {imageOptions.map((option) => (
                  <option key={option.value} value={option.imageUrl}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Change tag:</label>
              <select 
                value={editedPost.tag} 
                onChange={(e) => setEditedPost({ ...editedPost, tag: e.target.value })}
                className={styles.selection}
              >
                <option value="" disabled>Select a tag</option>
                {tagsList.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttonsWrapper}>
              <button className={styles.adminButton} type="button" onClick={handleCancelEdit}>Cancel</button>
              <button className={styles.adminButton} type="submit">Save</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className={styles.individualPostContainer}>
            {image && (
              <div>
                <Image
                  src={image}
                  alt={title}
                  width={400}
                  height={300}
                  className={styles.individualPostImage} />
              </div>
            )}
            <h3 className={styles.individualPostTitle}>{title}</h3><br />
            <div className={styles.individualPostDescription} dangerouslySetInnerHTML={{ __html: description }} /><br /><br />
            <div className={styles.tagDateWrapper}>
              <div className={styles.tagWrapper}>
                {tag && <p className={styles.individualPostTag}>{tag}</p>}
              </div>
              <p className={styles.individualPostDate}>Created At: {new Date(createdAt).toLocaleString()}</p>
            </div>
            {session && !showDeleteConfirmation && (
              <div className={styles.buttonsWrapper}>
                <button className={styles.adminButton} onClick={handleEdit}>Edit</button>
                <button className={styles.adminButton} onClick={() => setShowDeleteConfirmation(true)}>Delete</button>
              </div>
            )}
            {showDeleteConfirmation && (
              <div>
                <p className={styles.confirmationQuestion}>Are you sure you would like to delete this post?</p>
                <div className={styles.buttonsWrapper}>
                  <button className={styles.adminButton} onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                  <button className={styles.adminButton} onClick={handleDelete}>Delete</button>
                </div>
              </div>
            )}
          </div><CommentaryList postId={postId} />
        </>
      )}
    </>
  );
};

export default IndividualBlogPost;