import React from 'react';
import {Button, Container} from "@mui/material";
import Info from "../components/gallery/GalleryCard"
import { useLocation } from 'react-router';
import {makeStyles, styled} from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    container:{
        paddingTop: theme.spacing(10),
    },
}))

const Moment = (props) =>{
    const classes = useStyles();
    const {state} = useLocation()
    console.log(state.moment)
    
    return (
        <Container className={classes.container}>
            <Info
                moment = {state.moment}
            />
        </Container>
    )
}

export default Moment