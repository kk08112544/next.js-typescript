import React from 'react';
import { GetStaticProps } from 'next';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';
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

    console.log('Fetched data:', data); // Log fetched data

    // Ensure the response has the correct structure and default to an empty array if not
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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Invalid date string:', dateString);
    return 'Invalid date';
  }
};

const Home: React.FC<HomeProps> = ({ posts }) => {
  if (!Array.isArray(posts)) {
    return <Typography variant="h6" component="p">Failed to load posts.</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        <Navbar/>
      </Typography>
      <Grid>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ maxWidth: 2500, m: 2 }}>
              <CardContent>
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
                <Button href={'/editData/'+post.id} size="small" variant="outlined" sx={{ textTransform: 'none' }}>Edit</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
    </div>
  );
};

export default Home;
