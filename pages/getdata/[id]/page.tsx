import React from 'react'
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface myParams {
    params: {
        id: string
    }
}

async function getData(id:string){
    const res = await fetch('https://post-api.opensource-technology.com/api/posts/'+id)
    if(!res.ok){
        throw new Error('Failed to fetch data')
    }
    return res.json()
}


export default function page() {
  return (
    <div>
      
    </div>
  )
}
