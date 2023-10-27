import React, {useRef} from 'react';
import {
    Alert,
    Button,
    Paper,
    Container,
    Stack,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import ReactPlayer from 'react-player'
import ImageIcon from '@mui/icons-material/Image';
import {makeStyles, styled} from "@mui/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import {useDispatch} from "react-redux";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import {setMessage} from "../../redux/messageSlice";
import {useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: theme.spacing(5),
    },
    inside: {
        padding: theme.spacing(5),
    },
}))

const ProductImg = styled('img')({
    width: '100%',
    height: '80%',
    objectFit: 'cover',
    position: 'flex'
})

/**
 * function anouncement
 * @method AddShareMoment
 * @param [fresh={function that refresh the parent component}]
 * @return The component to add the new moment.
 */
const AddShareMoment = (props) => {
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [isvedio,setIsVideo] = useState(false);
    const [imageUrl,setImageUrl] = useState(null);
    const fileInput = useRef(null)
    const videoInput = useRef(null)
    const user = useSelector( (state) => state.user.userInfo)
    const dispatch = useDispatch();
    const fresh = props.fresh;
    const onFileChange = (event) => {
        setIsVideo(false)
        setFile(event.target.files[0]);
        setImageUrl(URL.createObjectURL(event.target.files[0]))
        fileInput.current.value = ''
    }
    const onVideoChange = (event) => {
        setIsVideo(true)
        setFile(event.target.files[0]);
        setImageUrl(URL.createObjectURL(event.target.files[0]))
        videoInput.current.value = ''
    }
    const classes = useStyles();
    

    const cleanImagePart = ()=>{
        setFile(null)
        setImageUrl(null)
    }
    const pushMoment = (body) => {
        axios.post("/api/moment/create", body).then(
            (res)=>{
                console.log(body)
                console.log(res)
                dispatch(setMessage({"info": "Create successful", "type": "success"}))
                fresh()
            }
        ).catch((err)=>{dispatch(setMessage({"info": "create failed", "type": "error"}))}); 
    }

    const handlePush = () => {
        if (user.id===null){

            navigate('/login')
            return

        }
        if(text.length<1){
            dispatch(setMessage({"info": "Too short text", "type": "error"}))
            return
        }
        setText("")
        let body = {
            user: user.id,
            text: text,
            img_url: "" 
        }
        if(file!==null){
            let reader = new FileReader();
            reader.readAsDataURL(file);   
            reader.onload=()=>{
                axios.post("/api/upload", {filename:file.name, content: reader.result, username:user.name}).then(
                    (res)=>{
                        body.img_url = res.data.fileUrl
                        pushMoment(body)
                    }
                ).catch((err)=>{dispatch(setMessage({"info": "Upload failed", "type": "error"}))}); 
            }
        }else{
            dispatch(setMessage({"info": "You need to add a picture or video to upload moments.", "type": "error"}))
        }
        cleanImagePart()
        setText("")
    }

    return(
        //<Container >
            <Paper >
                <Stack className={classes.inside} spacing={2}>
                    <Stack   direction={"row"}>
                        <TextField
                            id="standard-basic"
                            label="Share your moment"
                            placeholder="Let's say something"
                            size="small"
                            inputProps={{ maxLength: 254 }}
                            value={text}
                            onChange={(event) => {setText(event.target.value)}}
                            style={{ width: "100%" }}
                        />

                        <input ref={fileInput} type="file" accept="image/gif,image/jpeg,image/jpg,image/png" onChange={onFileChange} hidden/>
                        <input ref={videoInput} type="file" accept="video/mp4" onChange={onVideoChange} hidden/>
                        <IconButton onClick={()=>{fileInput.current.click()}} aria-label="reply" size="small">
                            <ImageIcon/>
                        </IconButton>
                        <IconButton onClick={()=>{videoInput.current.click()}} aria-label="reply" size="small">
                            <OndemandVideoIcon/>
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handlePush}
                        >
                            <Typography variant={"button"}> 
                                Push
                            </Typography>
                        </IconButton>
                    </Stack>
                    <Container sx={{display:(imageUrl!==null?"inline":"none")}}>
                        <Stack direction={"row"}>
                            {
                                isvedio?
                                (
                                    <ReactPlayer url={imageUrl} controls/>
                                )
                                :
                                (<ProductImg src={imageUrl}/>)
                            }
                            <Button onClick={()=>{cleanImagePart()}} aria-label="reply" size="small">
                                <DeleteIcon/>
                            </Button>
                        </Stack>
                    </Container>
                </Stack>
            </Paper>
        //</Container>
    )
}

export default AddShareMoment;