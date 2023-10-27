/*!
 * Author: Yuchen Shen
 * Do not use component in this file directly, use "./Comment.js" instead
 */
import React,{useState,useEffect} from "react";
import {makeStyles, styled} from "@mui/styles";
import {Button, Paper, Stack,Divider,Typography, Container, Box, MenuItem,TextField,InputAdornment,IconButton} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import QuickreplyIcon from '@mui/icons-material/Quickreply';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const useStyles = makeStyles((theme) => {
    return {
        root:{
            display: "flex",
            width: '100%',
        },
        reply: {
            paddingLeft:"10%",
            
        },
        inside: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(3),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3)
        },
        replying: {
            paddingTop:"2%",
        },
    }

})

const Icon = styled('img')((theme) => ({
    top: 0,
    width: '30px',
    height: '30px',
    objectFit: 'cover',
    // borderRadius: '50%'
}))



const DynamicIconButton = (data) => {
    const classes = useStyles();
    let text = data.text
    let icon = data.icon
    let actionInput = data.actionInput
    let disable = data.disable
    const [on, setOn] = React.useState(false);
    return (
        <IconButton aria-label="reply" size="small" onClick={()=>{data.onClick()}} onMouseOver={()=>{setOn(true)}} onMouseLeave={()=>{setOn(false)}}  disabled={disable}>
            {       
                on? 
                (   <>
                    {icon}
                    <Typography variant={"button"}> 
                        {text}
                    </Typography>
                    </>
                )
                :
                icon
            }
        </IconButton>

    )
}
/**
 * function anouncement
 * @method Reply
 * @return the structure of a single Reply
 */
const CommentCard = (data) =>{
    const classes = useStyles();
    let comment = data.comment;
    let userId = comment.userId;
    let comId = comment.comId;
    let fullName = comment.fullName
    let avatarUrl = comment.avatarUrl;
    let text = comment.text;
    let replies = comment.replies;
    if(avatarUrl===""){
        avatarUrl = "https://ui-avatars.com/api/name=" +fullName + "&background=random"
    }
    const [currentUser, setcurrentUser] = React.useState(data.currentUser);
    const [currentUserId, setCurrentUserId] = React.useState(data.currentUser.userId)
    useEffect(()=>{
        setcurrentUser(data.currentUser)
        setCurrentUserId(data.currentUser.userId)
    },[data.currentUser])

    let removeFun = data.remove;
    const [CommentValue, setCommentValue] = React.useState("");
    const [replying, setReplying] = React.useState("none");
    const changeReplying = () =>{
        setReplying("inline")
    }
    const [showSend, setShowSend] = React.useState(true);
    const send = ()=>{
        data.addreply(CommentValue)
        setCommentValue("")
        setShowSend(true)
    }
    return(
        <Stack>
            <Stack direction={"row"} divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                <Stack >
                    <Icon src={avatarUrl} />
                </Stack>
                <Stack>
                    <Typography variant={"subtitle2"}> 
                            {fullName}
                    </Typography>
                    <Typography variant={"text"}> 
                        {text}
                    </Typography>
                    <Stack direction={"row"}>
                        {
                            currentUserId === userId?
                            (
                                <>
                                <DynamicIconButton onClick={changeReplying} icon={<QuickreplyIcon fontSize="inherit" />} text={"Reply"}/>
                                <DynamicIconButton onClick={removeFun} icon={<DeleteIcon fontSize="inherit" />} text={"Delete"}/>
                                </>
                            ):
                            (
                                <DynamicIconButton onClick={changeReplying} icon={<QuickreplyIcon fontSize="inherit" />} text={"Reply"}/>
                            )
                        }
                    </Stack>
                </Stack>
            </Stack>

            <Box className={classes.replying} sx={{display:replying}}>
                <Stack  direction={"row"}>
                    <TextField
                        id="outlined-textarea"
                        label="Reply"
                        size="small"
                        placeholder={"Reply to "+ fullName}
                        multiline
                        fullWidth
                        value={CommentValue}
                        onChange={(e)=>{
                            setCommentValue(e.target.value)
                            if(e.target.value.length>0){
                                setShowSend(false)
                            }else{
                                setShowSend(true)
                            }
                        }}
                    />
                    <DynamicIconButton onClick={send} icon={<SendIcon fontSize="inherit" />} text={"Send"} disable={showSend}/>
                    <DynamicIconButton onClick={()=>{setReplying("none")}} icon={<CancelIcon fontSize="inherit" />} text={"Cancel"}/>
                </Stack>
            </Box>
        </Stack>
    )
}

/**
 * 方法说明
 * @method Reply
 * @return the structure of a single Reply
 */
const Reply = (data) => {
    const classes = useStyles();
    const refresh = data.refresh;
    const [comment, setComment] = React.useState(data.reply);
    const [deleted, setDeleted] = React.useState("inline");
    const [currentUser, setcurrentUser] = React.useState(data.currentUser);
    useEffect(()=>{
        setComment(data.reply)
        setcurrentUser(data.currentUser)
    },[data.reply,data.currentUser])

    const remove = ()=>{
        let body = {
            id:comment.comId
        }
        axios.post("/api/recipe/reply/delete", body).then(
            (res)=>{
                refresh()
            }
        ).catch((err)=>{
            console.log(err)
        })
    }
    
    return (
        <Box className={classes.reply} sx={{display:deleted}}>
            <CommentCard comment={comment} currentUser={currentUser} remove={remove} addreply={data.addreply}/>
        </Box>
    )
}
/**
 * 方法说明
 * @method Comment
 * @return the structure of a single Comment
 */
const Comment = (data) => {
    const classes = useStyles();
    const [currentUser, setcurrentUser] = React.useState(data.currentUser);
    let comment = data.comment;
    const refresh = data.refresh;
    
    let tempreplies = comment.replies
    if(tempreplies===undefined || tempreplies===null){
        tempreplies = [];
    }
    const [deleted, setDeleted] = React.useState("inline");
    const [replies, setReplies] = React.useState(tempreplies);
    useEffect(()=>{
        setReplies(tempreplies)
        setcurrentUser(data.currentUser)
    },[tempreplies,data.currentUser])

    const remove = ()=>{
        let body = {
            id:comment.comId
        }
        axios.post("/api/recipe/comment/delete", body).then(
            (res)=>{
                refresh()
                // setDeleted("none")
            }
        ).catch((err)=>{
            console.log(err)
        })
        
    }
    const addReply=(text)=>{
        let body = {
            user:currentUser.userId, 
            comment:comment.comId,
            text:text
        }
        axios.post("/api/recipe/reply/create",body).then(
            (res)=>{
                refresh()
            }
        ).catch((err)=>{
            console.log(err)
        })
    }
    
    return (
        <Box sx={{display:deleted}}>
            <CommentCard comment={comment} currentUser={currentUser} remove={remove} addreply={addReply}/>
            <Stack className={classes.inside} spacing={1}>
                {replies.map(
                    (reply, index) => {
                        return (<Reply key={"reply-"+index}  reply={reply} currentUser={currentUser} refresh={refresh}  addreply={addReply}/>)
                    }
                )}
            </Stack>
        </Box>
    )

}
/**
 * 方法说明
 * @method CommentSection
 * @return the main structure of Comment
 */
const CommentSection = (data) => {
    const classes = useStyles();
    const [comments, setComments] = React.useState(data.comments);
    const [showSend, setShowSend] = React.useState(true);
    const [currentUser, setcurrentUser] = React.useState(data.currentUser);
    const recipeId = data.recipeId
    const refresh = data.refresh
    const [CommentValue, setCommentValue] = React.useState("");
    const addComment = () => {
        let body = {
            user:currentUser.userId, 
            recipe:recipeId,
            text:CommentValue
        }
        axios.post("/api/recipe/comments/create",body).then(
            (res)=>{
                refresh();
                setCommentValue("");
                setShowSend(true);
            }
        ).catch((err)=>{
            console.log(err)
        })
    }
    useEffect(()=>{
        setComments(data.comments)
        setcurrentUser(data.currentUser)
    },[data.comments,data.currentUser])
    return (
        <Stack className={classes.root}>
            <Box className={classes.inside}>
                <Stack  direction={"row"}>
                    <TextField
                        id="outlined-textarea"
                        label="Reply"
                        size="small"
                        placeholder="Comment"
                        multiline
                        fullWidth
                        value={CommentValue}
                        onChange={(e)=>{
                            setCommentValue(e.target.value)
                            if(e.target.value.length>0){
                                setShowSend(false)
                            }else{
                                setShowSend(true)
                            }
                        }}
                    />
                    <DynamicIconButton onClick={addComment} icon={<SendIcon fontSize="inherit" />} text={"Send"} disable={showSend}/>
                </Stack>
            </Box>
            <Stack className={classes.inside} >
            {
                comments.map((comment, index)=>{
                    return (
                        <Comment key={"comment-"+index} comment={comment} currentUser={currentUser} refresh={refresh}/>
                    )
                })
            }
            </Stack>   
        </Stack>
    )

}

export default CommentSection;