import {Grid} from "@mui/material";
import { useEffect, useState } from "react";
import Post from "./Post";
import React from "react";
import axios from 'axios';
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: theme.spacing(5)
    }
}))
// Display all the post at once in the main page
const PostList = () => {
    const classes = useStyles();
    const [recipes, setRecipes] = React.useState([])
    const fresh = () => {
        axios.get(`/api/recipe/getAll`)
        .then((res)=>{
            console.log(res.data)
            setRecipes(res.data.recipes)

        }).catch((err)=>{
            console.log(err)
        })
    }

    useEffect( ()=> {
        fresh()    
 
      }, [])
    const getRecipesCard = (Obj) => {
        return (
          <Grid key={Obj.id} item xs={12} sm={6} md={4}>
              <Post {...Obj}  />
          </Grid>
        );
    };
 
  
// Return all the recipes and render
    return(
        <Grid container spacing={2} className={classes.root}>
            
            {recipes.map((Obj) => getRecipesCard(Obj))}        
              
        </Grid>
    )
}

export default PostList;