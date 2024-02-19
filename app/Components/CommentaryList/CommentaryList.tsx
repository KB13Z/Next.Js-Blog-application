import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios'
import styles from './CommentaryList.module.css'

interface Commentary {
  _id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
}

interface CommentaryListProps {
  postId: string;
}

const CommentaryList: React.FC<CommentaryListProps> = ({ postId }) => {
  const { data: session } = useSession();
  const [commentaries, setCommentaries] = useState<Commentary[]>([]);
  const [newCommentary, setNewCommentary] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCommentariesCount, setTotalCommentariesCount] = useState<number>(0);
  const [commentaryError, setCommentaryError] = useState<string>('');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const commentariesPerPage = 5;

  useEffect(() => {
    if (session?.user?.name) {
      setAuthorName(session.user.name);
    }
  }, [session]);

  const fetchCommentaries = useCallback(async () => {
    try {
      const response = await axios.get(`/api/getCommentaries/${postId}`, {
        params: {
          page: currentPage,
          limit: commentariesPerPage,
        },
      });

      setCommentaries(response.data);

      const totalCountHeader = response.headers['x-total-count'];
      const totalCommentariesCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
      setTotalCommentariesCount(totalCommentariesCount);

      const totalPages = Math.ceil(totalCommentariesCount / commentariesPerPage);
      setCurrentPage(currentPage => Math.min(currentPage, totalPages));
    } catch (error) {
      console.error('Error fetching commentaries:', error);
    }
  }, [postId, currentPage, commentariesPerPage]);

  useEffect(() => {
    fetchCommentaries();
  }, [fetchCommentaries]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/addCommentary', {
        postId,
        author: authorName,
        text: newCommentary,
      });

      const addedCommentary = response.data.commentary;

      setNewCommentary('');

      if (!session) {
        setAuthorName('');
      }

      setTotalCommentariesCount(prevCount => prevCount + 1);
      setCurrentPage(1);

      setCommentaries(prevCommentaries => [addedCommentary, ...prevCommentaries]);
      fetchCommentaries();
      setCommentaryError('');
    } catch (error) {
      console.error('Error submitting commentary:', error);
    }
  };

  const isCommentaryValid = newCommentary.length >= 3;

  const handleCommentaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setNewCommentary(value);

    if (value.length < 3 || value.length > 200) {
      setCommentaryError('Commentary must be between 3 to 200 characters long.');
    } else {
      setCommentaryError('');
    }
  };

  const handleDeleteCommentary = async (commentaryId: string) => {
    try {
      await axios.delete(`/api/deleteCommentary/${commentaryId}`);
      
      setCommentaries(prevCommentaries => prevCommentaries.filter(commentary => commentary._id !== commentaryId));
      
      setTotalCommentariesCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error deleting commentary:', error);
    }
  };

  const handleDeleteConfirmation = (commentaryId: string) => {
    setDeleteConfirmationId(commentaryId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationId(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = totalCommentariesCount === 0 ? 0 : (currentPage - 1) * commentariesPerPage + 1;
  const endIndex = Math.min(currentPage * commentariesPerPage, totalCommentariesCount);
  const totalPages = Math.ceil((totalCommentariesCount) / commentariesPerPage);

  return (
    <div className={styles.commentariesContainer}>      
      <form onSubmit={handleSubmit} className={styles.commentaryForm}>
        <h3 className={styles.formTitle}>Add commentary</h3>
        <div className={styles.formInputWrapper}>
          <label className={styles.commentaryFormLabel}>Author name:</label>
          <input 
            type='text'
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={styles.formInput}
            minLength={3}
            maxLength={25}
            required
          />
        </div>
        <div className={styles.formInputWrapper}>
          <label className={styles.commentaryFormLabel}>
            Write your thoughts:
          </label>
          <textarea
              value={newCommentary}
              onChange={handleCommentaryChange}
              className={styles.commentaryFormTextarea}
              minLength={3}
              maxLength={200}
              required
          />{commentaryError && <p className={styles.error}>{commentaryError}</p>}<br />
        </div>
        <div className={styles.commentaryButtonWrapper}>
            <button type="submit" disabled={!isCommentaryValid} className={styles.commentaryFormSubmitButton}>Submit</button>
        </div>
      </form>
      <div className={styles.commentariesWrapper}>
        <h3 className={styles.commentariesTitle}>Commentaries</h3>
        {commentaries.length === 0 ? (
          <p className={styles.noCommentariesMessage}>
            There are no commentaries for this post. <br/> Be the first one to leave your thoughts!
          </p>
        ) : (
          commentaries.map((commentary) => (
            <div key={commentary._id} className={styles.commentary}>
              <div>
                <p className={styles.commentaryAuthor}>{commentary.author}:</p><br />
                <p>{commentary.text}</p><br />
                <p className={styles.commentaryDate}>Created At: {new Date(commentary.createdAt).toLocaleString()}</p>
              </div>
              {deleteConfirmationId === commentary._id ? (
                <div>
                  <p className={styles.deleteQuestion}>Are you sure you would like to delete this commentary?</p>
                  <div className={styles.buttonsWrapper}>
                    <button onClick={() => handleDeleteCommentary(commentary._id)} className={styles.adminButton}>Delete</button>
                    <button onClick={handleCancelDelete} className={styles.adminButton}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  {session && (
                    <div className={styles.buttonWrapper}>
                      <button onClick={() => handleDeleteConfirmation(commentary._id)} className={styles.adminButton}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <div className={styles.pagination}>
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)} className={styles.paginationButton}>Previous</button>
          )}
          {commentaries.length > 0 && (
          <span>
            {startIndex}-{endIndex} of {totalCommentariesCount}
          </span>
          )}
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)} className={styles.paginationButton}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentaryList;