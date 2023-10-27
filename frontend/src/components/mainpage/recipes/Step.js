import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

/*
This is the step component, which will shows pictures 
and descriptions


*/
export default function Step(props) {
  const {name, description,img_url} = props;
  
  return (
    <Container sx = {{paddingTop: 5}}>
    <Card sx={{ maxWidth: 700 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="200"
        image={img_url}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" 
        >
          {name}
          
        </Typography>
        <Typography variant="body2" color="text.secondary" 
         >
           {description}
           </Typography>
      </CardContent>
   
    </Card>
    </Container>
  );
}
