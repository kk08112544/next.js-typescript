import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Navbar from '@/components/Navbar';

type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
};

type HomeProps = {
  posts: Post[];
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch('https://post-api.opensource-technology.com/api/posts?page=1&limit=10');
    const data = await res.json();
    const posts = Array.isArray(data.posts) ? data.posts : [];

    return {
      props: { posts },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: { posts: [] },
    };
  }
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Invalid date string:', dateString);
    return 'Invalid date';
  }
};

const saveChanges = async (postId: string, updatedData: Partial<Post>) => {
  try {
    const res1 = await fetch(`https://post-api.opensource-technology.com/api/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const res2 = await fetch(`https://post-api.opensource-technology.com/api/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ published: true }),
    });

    if (res1.ok && res2.ok) {
      console.log('Post updated successfully');
      return true;
    } else {
      console.error('Failed to update post');
      return false;
    }
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
};

const fetchPostById = async (postId: string) => {
  try {
    const res = await fetch(`https://post-api.opensource-technology.com/api/posts/${postId}`);
    if (res.ok) {
      const postData = await res.json();
      return postData;
    } else {
      console.error('Failed to fetch post data');
      return null;
    }
  } catch (error) {
    console.error('Error fetching post data:', error);
    return null;
  }
};

const deletePost = async (postId: string, setDeleteSuccess: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    const res = await fetch(`https://post-api.opensource-technology.com/api/posts/${postId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      console.log('Post deleted successfully');
      setDeleteSuccess(true);
    } else {
      console.error('Failed to delete post');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

const Post: React.FC<HomeProps> = ({ posts: initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleEditClick = async (post: Post) => {
    setCurrentPost(post);
    setEditModalOpen(true);

    try {
      const postData = await fetchPostById(post.id);
      if (postData) {
        setEditedTitle(postData.title);
        setEditedContent(postData.content);
      } else {
        console.error('Failed to fetch post data for editing');
      }
    } catch (error) {
      console.error('Error fetching post data for editing:', error);
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setCurrentPost(null);
  };

  const handleSaveChanges = async () => {
    if (currentPost) {
      const success = await saveChanges(currentPost.id, { title: editedTitle, content: editedContent });
      if (success) {
        handleSearch();
      }
      handleModalClose();
    }
  };

  const handleDeletePost = async () => {
    if (currentPost) {
      await deletePost(currentPost.id, setDeleteSuccess);
      handleSearch();
      handleModalClose();
    }
  };

  const handleSearch = async () => {
    try {
      console.log(searchTerm);
      console.log(page);
      console.log(limit);
      const url = searchTerm
        ? `https://post-api.opensource-technology.com/api/posts?term=${searchTerm}&page=${page}&limit=${limit}`
        : `https://post-api.opensource-technology.com/api/posts?page=${page}&limit=${limit}`;
      const res = await fetch(url);
      const data = await res.json();
      const posts = Array.isArray(data.posts) ? data.posts : [];
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        <Navbar />
      </Typography>
      <div className="search-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search by Title"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <TextField
          label="Page Number"
          type="number"
          variant="outlined"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          style={{ marginRight: '1rem' }}
        />
        <TextField
          label="Limit Per Page"
          type="number"
          variant="outlined"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{ marginRight: '1rem' }}
        />
        <Button variant="contained" color="primary" sx={{ textTransform: 'none' }} onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Grid container spacing={2} direction="column">
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card sx={{ maxWidth: 2500, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ padding: 1 }}>
                  {formatDate(post.created_at)}
                </Typography>
                <div>
                  <Button size="small" variant="outlined" sx={{ textTransform: 'none', mb: 1 }} onClick={() => handleEditClick(post)}>
                    Edit
                  </Button>
                </div>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={editModalOpen} onClose={handleModalClose}>
        <DialogTitle sx={{ textAlign: 'center' }}>Edit Post</DialogTitle>
        <DialogContent>
          {currentPost && (
            <>
              <label htmlFor="title">Title</label>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                type="text"
                fullWidth
                variant="outlined"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
              <label htmlFor="content">Content</label>
              <TextField
                margin="dense"
                id="content"
                type="text"
                fullWidth
                variant="outlined"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
  <Button
    onClick={handleSaveChanges}
    sx={{ textTransform: 'none', backgroundColor: 'green', color: 'white' }}
    fullWidth
  >
    Save
  </Button>
  <Button
    onClick={handleModalClose}
    sx={{ textTransform: 'none', backgroundColor: 'orange', color: 'white' }}
    fullWidth
  >
    Cancel
  </Button>
  {currentPost && (
    <Button
      onClick={handleDeletePost}
      sx={{ textTransform: 'none', backgroundColor: 'red', color: 'white' }}
      fullWidth
    >
      Delete
    </Button>
  )}
</DialogActions>

      </Dialog>
    </div>
  );
};

export default Post;
