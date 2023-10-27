
import React, {useState,useEffect} from 'react';
import {makeStyles, styled} from "@mui/styles";
import {Button, Link, Stack,Divider,Typography, Container} from "@mui/material";
import ReactPlayer from 'react-player'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {useSelector} from "react-redux";
const axios = require('axios');

const ProductImg = styled('img')({
    top: 0,
    width: '80%',
    height: '80%',
    maxHeight: 400,
    objectFit: 'cover',
    position: 'flex',

})

const Icon = styled('img')((theme) => ({
    top: 0,
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '50%',
    cursor: "pointer"
}))

const IconButton = styled('button')((theme) => ({
    backgroundColor: "transparent",
    borderRadius: '50%',
    borderColor: "transparent"
}))


const useStyles = makeStyles((theme) => {
    return {
        root:{
            display: "flex",
            width: '100%',
            marginBottom: theme.spacing(5)
        },
        left: {
            marginTop: theme.spacing(3),
            marginLeft: theme.spacing(3),
            display: "flex",
            flexDirection: "column",
            width: "10%"
        },
        right: {
            marginTop: theme.spacing(3.5),
            marginBottom: theme.spacing(3),
            marginRight: theme.spacing(4),
            flexDirection: "column",
            width: '100%'
        },
        content: {
          marginRight: theme.spacing(15),
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          display: 'block'
        },
        avatar: {
            height: '50px',
            width: '50px',
            borderRadius: '50%'
        },
        details: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(5)
        },

        vid: {
            margin: 'auto'
        }
        
    }

})
/**
 * function anouncement
 * @method Info
 * @param [moment={moment.user, moment.id,moment.text}]
 * @return A moment card
 */
const Info = (props) => {
    const navigate = useNavigate();
    const classes = useStyles()
    let moment = props.moment
    let user = moment.user
    let momentId = moment.id
    const [username, setUsername] = useState("");
    
    const [avatar, setAvatar] = useState("");
    const [like, setlike] = useState(false);
    const [show, setShow] = useState(false);
    const currentUser = useSelector( (state) => state.user.userInfo.id)
    const preprocess = () => {
        axios.get("/api/user/get/?id="+user).then(
            res=>{
                if(res.data.avatar === ""){
                    setAvatar("https://ui-avatars.com/api/name=" +res.data.username + "&background=random")
                }else{
                    setAvatar(res.data.avatar)
                }
           
                setUsername(res.data.username)
                
                axios.get( "/api/moment/ifLiked/?user_id="+user+"&moment_id="+momentId).then(
                    (resu) => {
                        if(resu.data.Status === "yes"){
                            setlike(true)
                        }else{
                            setlike(false)
                        }
                        setShow(true)
                    }
                )
            }

        )
        
    }

    useEffect(()=>{
        preprocess()
    },[])
    let media = moment.img_url

    const toProfile = (index) => {
        navigate("/profile/" + index)
    }
    const handleLike = ()=>{
        
        if (currentUser===null){
            navigate('/login')
            return;
        }
        else{
            if (!like){

                 
                axios.post("/api/moment/like",{moment_id:momentId,user_id:user})
                .then((res)=>{setlike(true)})
                .catch(err=>{console.log(err)})

            }
            else {
                axios.post("/api/moment/dislike",{moment_id:momentId,user_id:user})
                .then((res)=>{setlike(false)})
                .catch(err=>{console.log(err)})
            }
        }
         
        

    };
    const getMediaType = (img_url)=>{
        try{
            let keywords = img_url.split('.')
            let keyword = keywords[keywords.length-1]
            if(keyword==="mp4"){
                return "vedio"
            }else{
                return "picture"
            }
        }catch(err){
            return "none"
        }
    }
    let type = getMediaType(media)
    let content = moment.text
    return (
        <Stack sx={{display:(show?"inline":"none")}}>
        <div className={classes.root}>
                <div className={classes.left}>
                <Link onClick={() => toProfile(user)} color="inherit" underline="hover">
                  
                    <IconButton>
                        <Icon src={avatar }/>
                    </IconButton>
                    </Link>
                </div>
                <div className={classes.right}>
                <Stack divider={<Divider flexItem />} spacing={1}>
                    <Link onClick={() => toProfile(user)} color="inherit" underline="hover">
                            <Typography variant={"subtitle2"} noWrap>
                            {username}
                            </Typography>
                        </Link>
                  
                    <div>
                    <Typography variant={'text'} className={classes.content}>
                        {content}
                    </Typography>
                    <Container sx={{display:((type!=="none"&&media!=="")?"inline":"none")}}>
                            {
                                type==="picture"?
                                (<ProductImg src={media}/>)
                                :
                                (<Container>
                                <ReactPlayer width={"100%"} className={classes.vid} url={media} controls/>
                                </Container>)
                            }
                    </Container>
                    </div>
                    <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                    {
                        like?
                        <Button color="primary" onClick={()=>{
                            handleLike()
                        }} variant="outlined" startIcon={<FavoriteIcon />}>Unlike</Button>
                        :
                        <Button color="primary" onClick={()=>{
                            handleLike()
                            }} variant="outlined" startIcon={<FavoriteBorderIcon />}>Like</Button>
                    }
                    </Stack>
                </Stack>
        </div>
        </div>
        </Stack>
    )
}

export default Info