import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const NewPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    try {
      await axios.post('https://post-api.opensource-technology.com/api/posts', {
        title,
        content,
      });
      alert('Post saved successfully');
      router.push(`/drafts`);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handlePublish = async () => {
    try {
      // Send POST request to create a new post
      const postResponse = await axios.post('https://post-api.opensource-technology.com/api/posts', {
        title,
        content,
      });
      
      // Extract the post ID from the response
      const postId = postResponse.data.id;
  
      // Send PATCH request to update the published status of the post
      const res = await fetch(`https://post-api.opensource-technology.com/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: true }),
      });
  
      // Notify the user of success and redirect to home page
      alert('Post published successfully');
      router.push('/');
    } catch (error) {
      // Handle errors and notify the user of failure
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    }
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 600, width: '100%', padding: '20px', boxSizing: 'border-box' }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            New Post
          </Typography>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', height: '200px', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <Button variant="contained" onClick={handleSave} style={{ flex: '1', textTransform: 'none'}}>
                Save
            </Button>
              <Button variant="contained" onClick={handleCancel} style={{ flex: '1', textTransform: 'none'}}>
                Cancel
              </Button>
            </div>
            <Button variant="contained" onClick={handlePublish} style={{ fontWeight: 'bold', textTransform: 'none' }}>
              Publish Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPost;
