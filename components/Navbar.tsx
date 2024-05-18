import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export default function Navbar() {
  return (
    <Box sx={{ padding: 2 }}>
    <Stack direction="row" spacing={2}>
      <Button href={'/'} style={{ textTransform: 'none' }}>Post</Button>
      <Button href={'/drafts'} style={{ textTransform: 'none' }}>Draft</Button>
      <Box sx={{ marginLeft: 'right' }} >
        <Button variant="contained" color="success" href={'/CreateNew'} style={{ textTransform: 'none' }}>
          Create Draft
        </Button>
      </Box>
    </Stack>
  </Box>
  
  );
}
