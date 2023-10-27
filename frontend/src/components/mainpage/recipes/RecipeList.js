import {Grid} from "@mui/material";
import Recipe from "./Recipe";
import React from "react";
import axios from 'axios';
import { useEffect, useState } from "react";

/*

Recipe list will list all recomendation recipe, we will have 4 in total

*/

const RecipeList = () => {
    const [recipes, setRecipes] = React.useState([])

    const fresh =  () => {
        axios.get(`/api/recipe/getAll`)
        .then((res)=>{
            if (res.data.recipes.length <= 4){
                 
                 
                setRecipes(res.data.recipes)
            }
            else{
                
                setRecipes(res.data.recipes.reverse().slice(0,4))
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    useEffect( ()=> {
        fresh()    
      }, [])


    return(
        <Grid container spacing={3}>
              {recipes.map((item) =>
                  <Grid key={item.id} item xs={12} sm={6} md={3}>
                    <Recipe {...item}  />
                  </Grid>
              )}
        </Grid>
    )
}

export default RecipeList;