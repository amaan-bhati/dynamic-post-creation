import React, { useState, useEffect } from 'react';
import './PostPage.css';

const PostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [ogImageUrl, setOgImageUrl] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    const response = await fetch('http://localhost:3001/generate-og-image', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setOgImageUrl(data.imageUrl);
  };

  useEffect(() => {
    if (ogImageUrl) {
      const metaTag = document.createElement('meta');
      metaTag.setAttribute('property', 'og:image');
      metaTag.setAttribute('content', ogImageUrl);
      document.head.appendChild(metaTag);
    }
  }, [ogImageUrl]);

  return (
    <div className="post-page">
      <h1 class="heading">Create a New Post</h1>
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
      <input class="img-btn" type="file" accept="image/*" onChange={handleImageChange} />
      {image && <img src={URL.createObjectURL(image)} alt="Selected" className="post-image-preview" />}
      <button onClick={handleSubmit}>Submit Post</button>
      {ogImageUrl && (
        <div>
          <h2>Generated OG Image</h2>
          <img src={ogImageUrl} alt="OG" className="og-image-preview" />
        </div>
      )}
    </div>
  );
};

export default PostPage;
