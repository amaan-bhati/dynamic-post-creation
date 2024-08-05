import React, { useState } from 'react';
import './PostPage.css';

const PostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
  
    const response = await fetch('/generate-og-image', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log('Generated OG Image URL:', data.imageUrl);
  };
  
  return (
    <div className="post-page">
      <h1>Create a New Post</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && <img src={image} alt="Selected" className="post-image-preview" />}
      <button onClick={handleSubmit}>Submit Post</button>
    </div>
  );
};

export default PostPage;
