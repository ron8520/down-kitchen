import React from 'react';
import {Button, Container, Stack, Typography} from "@mui/material";
import RecipeList from "../components/mainpage/recipes/RecipeList";
import PostList from "../components/mainpage/posts/PostList";
import {makeStyles, styled} from "@mui/styles";
import {useNavigate} from "react-router-dom";


/**
 * The landing page, display current user post and recommendation recipes
 *
 */
const Announcement = styled('div')(({ theme }) => ({
    height: '30px',
    backgroundColor: "teal",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 500,
}))

const useStyles = makeStyles((theme) => ({
    container:{
        paddingTop: theme.spacing(10),
    },
    title:{
        fontWeight: "bold",
        marginBottom: theme.spacing(2),
    },
    daily: {
        fontWeight: "bold",
        paddingTop: 15,
        paddingBottom: 15
    },
    recipe:{
        marginTop: theme.spacing(2)
    }
}))

const MainPage = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/createrecipe')
    }

    return (
          <Container className={classes.container}>
                  <Announcement> Tips: Read the recipe all the way through before you start</Announcement>
                  <Typography variant={"h5"} className={classes.daily} >
                Daily Recommendation
            </Typography>

            <RecipeList />

            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                mb={5}
                className={classes.recipe}
            >
                <Typography variant={"h5"} className={classes.title} style={{paddingTop: 15}}>
                    Recipes from other User
                </Typography>

                 <Button variant={"contained"} onClick={() => handleClick()}>
                    New Recipe
                 </Button>
            </Stack>
            <PostList />
        </Container>
    )
}


export default MainPage;