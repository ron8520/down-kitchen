import { Container, ImageList, ImageListItem, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import axios from 'axios';
import { useEffect, useState } from "react";
import {Image} from "../components/profile/UserPost";
import {useNavigate} from "react-router-dom";

/**
 * Right side component
 */
const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(5),
        position: "sticky",
        top: 0,
        border: "1px solid #ece7e7",
    },
    title:{
        frontSize: 16,
        fontWeight: 500,
        color: "#555",
        marginBottom: 10
    }

}))

const RightSide = () => {
    const navigate = useNavigate()
    const classes = useStyles();
    const [moments, setMoments] = useState([]);
    const fresh = ()=>{
        axios.get("/api/moment/feature").
        then(
            (res)=>{
                console.log(res.data.moments)
                setMoments(res.data.moments)
                console.log(moments)
            }
        ).catch((err)=>{
            console.log(err)
        })
    }
    useEffect(() => {
        fresh()
    }, [])

    const handleOnClick = (user, moment_id, text, img_url) => {
        let moment = {
            user: user, 
            id: moment_id,
            text: text,
            img_url: img_url
        }
        navigate('/gallery/detail', {state: {moment: moment}})
    }
  
    return (
       <Container className={classes.container}>
           <Typography className={classes.title} gutterBottom>
               Recent updated
           </Typography>

           <ImageList rowHeight={200} style={{ marginBottom: 20}} cols={1}>
        
            {moments.map((item,index)=>(
              <ImageListItem key = {index}>
                <Image
                  src={item.img_url}
                  onClick = {e => handleOnClick(item.user, item.moment_id, item.text, item.img_url)}
                />
              </ImageListItem>
            ))}
         </ImageList> 
       </Container>
    )
}

export default RightSide;