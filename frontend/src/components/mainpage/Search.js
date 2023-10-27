import {Grid, Typography} from "@mui/material";
import { useEffect } from "react";
import React from "react";
import axios from 'axios';
import Post from "./posts/Post";
import {useParams} from 'react-router-dom';
import Container from "@mui/material/Container";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    container:{
        paddingTop: theme.spacing(15),
    },
    title: {
        paddingBottom: theme.spacing(3)
    }
}))


const Search = () => {
    const classes = useStyles();
    const [recipes, setRecipes] = React.useState([])
    const { keyword } = useParams();
    const fresh = () => {
        axios.get(`/api/recipe/search?q=` + keyword)
        .then((res)=>{
            setRecipes(res.data.recipes)
    
        }).catch((err)=>{
            console.log(err)
        })
    }

    useEffect( ()=> {
        fresh()
      }, [keyword])
    const getRecipesCard = (Obj) => {
        return (
          <Grid key={Obj.id} item xs={12} sm={6} md={4}>
              <Post {...Obj}  />
          </Grid>
        );
    };

    return(
        <Container className={classes.container}>
            <Typography variant={"h4"} className={classes.title}>
                Result:
            </Typography>
           <Grid container spacing={2}>
            {
                recipes.length === 0 ? (
                    <Typography variant={"h6"} sx={{paddingTop: '20px'}}>
                        Result not found!
                    </Typography>
                    ) : (
                        recipes.map((Obj) => getRecipesCard(Obj))
                )}
            </Grid>
        </Container>
    )
}

export default Search;