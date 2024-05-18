import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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
    const res = await fetch('https://post-api.opensource-technology.com/api/posts/draft');
    const data = await res.json();

    console.log('Fetched data:', data);

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

const publishPost = async (postId: string, setPublishSuccess: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    const res = await fetch(`https://post-api.opensource-technology.com/api/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ published: true }),
    });
    if (res.ok) {
      console.log('Post published successfully');
      setPublishSuccess(true);
    } else {
      console.error('Failed to publish post');
    }
  } catch (error) {
    console.error('Error publishing post:', error);
  }
};

const Drafts: React.FC<HomeProps> = ({ posts }) => {
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!Array.isArray(posts)) {
    return <Typography variant="h6" component="p">Failed to load posts.</Typography>;
  }

  if (deleteSuccess || publishSuccess) {
    window.location.reload();
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        <Navbar/>
      </Typography>
      <Grid>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ maxWidth: 2500, display: 'flex', flexDirection: 'column', height: '100%', m: 2 }}>
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
                  <Button size="small" variant="outlined" sx={{ textTransform: 'none', mb: 1 }}>Edit</Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'none', mb: 1 }}
                    onClick={() => publishPost(post.id, setPublishSuccess)}
                  >
                    Publish
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'none', mb: 1 }}
                    onClick={() => deletePost(post.id, setDeleteSuccess)}
                  >
                    Delete
                  </Button>
                </div>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Drafts;

