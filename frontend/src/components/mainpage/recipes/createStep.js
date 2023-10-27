import * as React from 'react';
import Card from '@mui/material/Card';
import {Stack} from "@mui/material";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {makeStyles,styled} from "@mui/styles";
import Container from '@mui/material/Container';

export default function createStep(props) {
    const stepCount = props.title.StepCount;
    const title = props.title.title;
    const desc = props.title.desc;
    const file = props.title.file;
    const imgUrl = props.title.file;
    console.log(props.title)
    const test123 = "Step1"
    const ProductImg = styled('img')({
        width: '100%',
        height: '80%',
        objectFit: 'cover',
        position: 'flex'
    })
  return (
    <Container sx = {{paddingTop: 5}}>
    <Card sx={{ maxWidth: 700 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        image={URL.createObjectURL(imgUrl)}
      />
      <CardContent>

        <Typography gutterBottom variant="h5" component="div">
          STEP {stepCount}: {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {desc}
        </Typography>
        
      </CardContent>
   
    </Card>
    </Container>
  );
}
