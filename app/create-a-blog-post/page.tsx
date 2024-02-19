'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import TextEditor from '../Components/TextEditor/TextEditor'
import styles from './page.module.css'

interface ImageOption {
  value: string;
  label: string;
  imageUrl: string;
}

export default function CreateBlogPost() {
  const [selectedImageOption, setSelectedImageOption] = useState<ImageOption | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>('');
  const [tagsList, setTagsList] = useState<string[]>([
    'DIY',
    'Pets',
    'Travel',
    'Recipe',
    'Inspiration',
  ]);
  const [formFilled, setFormFilled] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<string>('');

  useEffect(() => {
    setFormFilled(title.trim() !== '' && description.trim() !== '' && selectedOption !== '' && selectedImageOption !== null);
  }, [title, description, selectedImageOption, selectedOption]);

  const imageOptions: ImageOption[] = [
    { value: '1', label: 'DIY', imageUrl: '/DIY.jpg' },
    { value: '2', label: 'Pets', imageUrl: '/Pets.jpg' },
    { value: '3', label: 'Travel', imageUrl: '/Travel.jpg' },
    { value: '4', label: 'Recipe', imageUrl: '/Recipe.jpg' },
    { value: '5', label: 'Inspiration', imageUrl: '/Inspiration.jpg' },
  ];

  const handleImageDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOptionOfImage = imageOptions.find((option) => option.value === selectedValue) || null;
    setSelectedImageOption(selectedOptionOfImage);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value)
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  
    if (newTitle.length < 3 || newTitle.length > 150) {
      setTitleError('Title must be between 3 and 150 characters long');
    } else {
      setTitleError('');
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleNewTagSubmit = () => {
    if (newTag.trim() !== '') {
      setTagsList((prevTags) => [...prevTags, newTag]);
      setSelectedOption(newTag);
      setNewTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (titleError || description.length < 10 || description.length > 300) {
      console.log('Title is not within the character limit');
      return;
    };

    const postId = new Date().getTime();
    const createdAt = new Date().toISOString();
    const selectedTag: string = selectedOption;

    const newBlogPost = {
      id: postId,
      selectedImageOption,
      title,
      description,
      selectedOption,
      createdAt,
      tags: [selectedTag],
    };

    try {
      const responseBlogPost = await axios.post('/api/createBlogPost', newBlogPost);

      setSelectedImageOption(null);
      setTitle('');
      setDescription('');
      setSelectedOption('');
      setPreviewMode(false);

      console.log('Blog post saved successfully:', responseBlogPost.data);
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  };

  return (
      <div className={styles.createBlogContainer}>
        <h2>Create a new blog post</h2>
        <form className={styles.blogForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Title*:</label>
            <input 
              type="text"
              className={styles.input}
              value={title}
              onChange={handleTitleChange}
            />
            {titleError && <p className={styles.errorMessage}>{titleError}</p>}
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Description*:</label>
            <TextEditor value={description} onChange={handleDescriptionChange} description={description}/>
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Add image*:</label>
            <select value={selectedImageOption?.value || ''} onChange={handleImageDropdownChange} className={styles.selection}>
              <option value="" disabled>Select image</option>
              {imageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Create tag:</label>
            <input type="text" value={newTag} onChange={handleNewTagChange} className={styles.input} />
            <button type="button" onClick={handleNewTagSubmit} className={styles.tagButton}>
              Save
            </button>
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Add tag*:</label>
            <select value={selectedOption} onChange={handleDropdownChange} className={styles.selection}>
              <option value="" disabled>Select tag</option>
              {tagsList.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.submitButtonWrapper}>
            <button type='button' onClick={handlePreviewToggle} className={styles.previewButton} disabled={!formFilled}>
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
            <button type='submit' className={styles.submitButton} disabled={!formFilled}>Submit</button>
          </div>
          {!formFilled && <p className={styles.fillMessage}>Please fill in all fields marked with star(*), in order to see preview and to submit post!</p>}
        </form>
        {previewMode && (
            <div className={styles.previewContainer}>
              <h3 className={styles.previewHeading}>Preview:</h3>
              <div className={styles.preview}>
                {selectedImageOption && (
                  <div>
                    <Image
                      src={selectedImageOption.imageUrl}
                      alt={selectedImageOption.label}
                      width={400}
                      height={300}
                      className={styles.selectedImage}
                    />
                  </div>
                )} <br />
                <p className={styles.previewTitle}>{title}</p><br />
                <div dangerouslySetInnerHTML={{ __html: description }} /><br />
                <div className={styles.previewTagWrapper}>
                  <p className={styles.previewTag}>{selectedOption}</p>
                </div>
              </div>
            </div>
          )}
      </div>
  )
}

