
import React from 'react';
import {
    useParams, useNavigate
  } from 'react-router-dom';

import {Grid, Container, Stack, Typography} from "@mui/material";
import Slider from "../components/mainpage/recipes/Slider";
import Material from "../components/mainpage/recipes/material";
import Step from "../components/mainpage/recipes/Step";
import Description from "../components/mainpage/recipes/description";
import Comment from "../components/comment/Comment"

import {useEffect, useState} from 'react';

import {makeStyles} from "@mui/styles";
import axios from 'axios';
import { sliderItems } from '../components/mainpage/recipes/data';
/*

The page is to show all one recipe


*/
const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(10)
    }
}))
const Recipe = () => {
    const classes = useStyles();
    const { recipeId } = useParams();
    const [recipe, setRecipe] = React.useState([]);
    const [steps, setSteps] = React.useState([]);
    const [rows, setRows] = React.useState([]);

    const fresh = () => {
        axios.get(`/api/recipe/details/?recipe_id=${recipeId}`).
        then((res)=>{
            console.log(res.data)
            setRecipe(res.data)
            setSteps(res.data.steps)
            setRows(res.data.ingredients)
        }).catch((err)=>{
            console.log(err)
        })
    }

    useEffect( ()=> {
        fresh()    
 
      }, [])
      console.log(steps)
    return (
        
        <Container className={classes.root}>
            <Stack spacing={2}>
                <Typography variant="h2" component="div">{recipe.name}</Typography>
                <script>
document.write(5 + 6);</script>
                <Slider steps= {steps}/>
                <Description recipe_id={recipe.id} id={recipe.author_id} author={recipe.author} description={recipe.description}avatar = {recipe.avatar}/>
                <Typography variant="h4" component="div">Material Table</Typography>
                <Material  rows = {rows}/>
                <Typography variant="h4" component="div">Steps</Typography>
                <Grid>
                    {steps.sort(function(a, b) {
                            return a.order - b.order;
                            }).map((Obj)=> 
                     <Step key = {Obj.order} {...Obj}   />)
                    }
                </Grid>
            </Stack>
            
            <Comment recipeId={recipeId}/>

        </Container>
    )
}

export default Recipe;