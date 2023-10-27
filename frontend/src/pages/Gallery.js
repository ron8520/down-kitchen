import React, {useState,useEffect} from 'react';
import {Container, Stack,Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {useSelector} from "react-redux";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import GalleryCard from "../components/gallery/GalleryCard";
import AddShareMoment from "../components/gallery/AddShareMoment";
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(10)
    }
}))
let s = {shortname: "R", username: "Username", title:"Title", content:"content content content content content content content content content content content content content"}

const Card = (data)=>{
    return (
        <Paper elevation={2} 
            sx={{marginBottom:'0.5%'}}>
            <GalleryCard moment={data.moment}/>
        </Paper>
    )
}
const Gallery = () => {
    const classes = useStyles();
    const user = useSelector( (state) => state.user.userInfo)
    const [moments, setMoments] = useState([]);
    const fresh = ()=>{
        axios.get("/api/moment/getAll").
        then(
            (res)=>{
                console.log(res.data.moments)
                setMoments(res.data.moments.reverse())
            }
        ).catch((err)=>{
            console.log(err)
        })
    }
    useEffect(() => {
        fresh()
    }, [])
    return (
        <Container className={classes.root}>
            <Stack spacing={2}>
                <AddShareMoment fresh={fresh}/>
                    {
                        moments.map((moment, index)=>{
                            
                            return (
                               <Card key={index} moment={moment}/>
                            )
                        })
                    }

            </Stack>
        </Container>
    )
}

export default Gallery;