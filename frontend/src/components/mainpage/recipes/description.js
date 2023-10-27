 
import React, {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import {Container, Link, Typography} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import IconButton from '@mui/material/IconButton';
import {useDispatch, useSelector} from "react-redux";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import axios from "axios";
import {setMessage} from "../../../redux/messageSlice";

/*

this is the description component of recipe, which contents collection, like, userId, 
recipe descriptions


*/
export default function ImageAvatars(props) {
  const user = useSelector( (state) => state.user.userInfo);
  const {author, description, id, recipe_id,avatar} = props;
  const [like,setLike] = React.useState(false);
  const [collect,setCollect] = React.useState(false);
  const [report,setReport] = React.useState(false);
  const [follow,setFollow] = React.useState(false);
  const [collectionId, setCollectionId] = React.useState(-1)
 
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleFollow = () => {
    if (user.id === null) {
        navigate("/login")
    } else {
        if(follow){
          userUnfollow()
        }
        else{
          axios
            .post('/api/sub/create', {"user": id, "follow": user.id})
            .then((res) => {
               
                setFollow(true)
                dispatch(
                    setMessage({
                        "info": "Follow successful",
                        "type": "success"
                    })
                )
            })
            .catch((error) => {
                console.log(error)
             
            })
    }

        }
          
}
// Check if the user is followed or not
 
const userUnfollow = () => {
    axios
        .delete('/api/sub/delete', { data: {"user": id, "follow": user.id}})
        .then((res) => {
            setFollow(false)
           
            dispatch(
                    setMessage({
                        "info": "Unfollow successful",
                        "type": "success"
                    })
                )
        })
        .catch((error) => {
            console.log(error)
        
        })
}

//To check the current user has follow the user or not
//userId: target user Id
const getUserIsFollowed = () => {
    axios
        .post('/api/sub/get',  {"user": id})
        .then((res) => {
            for(var i = 0; i < res.data.length; i++){
                if (res.data[i].fields.follow == user.id){
                    setFollow(true)
                    break;
                }
            }

        })
        .catch((error) => console.log(error))
}

//Check it is like or not
  const checkIsLike = () => {
    if (user.id !== null){
       const q = {
          recipe_id: recipe_id,
          user_id: user.id
       };
        axios
        .post('/api/recipe/ifLiked/',q)
        .then((res) => {
      
             
            if (res.data.status==='yes') {
                setLike(true)
              }
 
        })
        .catch((error) => (console.log(error)))
    }
}

//click 
  const handleLike = ()=>{
    if (user.id === null) {
      navigate('/login')
    } 
  else {

    if (like) {
      axios.post('/api/recipe/dislike',{"user_id": user.id, "recipe_id": recipe_id})
      .then((res)=>{
        setLike(false)
        console.log(res.data)
        dispatch(setMessage({"info": "Disliked successfully!", "type": "success"}));
        
      })
      .catch(err=>{
        console.log(err)
      })
 
    }
    else {
       axios.post('/api/recipe/like', {"user_id": user.id, "recipe_id": recipe_id})
        .then( (res) => {
          setLike(true)
          dispatch(setMessage({"info": "Liked successfully!", "type": "success"}));
       
          

        }
               
        )
        .catch((error) => {
          console.log(error)
   
        })
      }
    }
  }

  //Check if it is collected or not
  const checkIsCollect = () => {
      if (user.id !== null){
          axios
          .get('/api/user/collection/get/?user_id=' + user.id)
          .then((res) => {
            console.log(res.data)
              for(var i = 0; i < res.data.collections.length; i++){
                if (recipe_id == res.data.collections[i].recipe_id) {
                  console.log(res.data.collections[i])
                  setCollect(true)
                  setCollectionId(res.data.collections[i].id)
                }
              }
          })
          .catch((error) => (console.log(error)))
      }
  }

  useEffect( () => {
      checkIsCollect()
      checkIsLike()
      getUserIsFollowed()
  }, [recipe_id])

  const handleCollect = () =>{
      if (user.id === null) {
          navigate('/login')
      } else {

        if (collect) {
          axios
          .delete('/api/collection/delete', {data: {"collection_id": collectionId}})
          .then((res) => {
            setCollect(false);
            dispatch(setMessage({"info": "Remove this from your collection successfully!", "type": "success"}));
                  
                 // dispatch(setMessage({"info": "Delete Collection successful", "type": "success"}));
              })
          .catch((error) => {
              console.log(error);
              //dispatch(setMessage({"info": "Delete Collection Fail, try again later!", "type": "error"}));
          })
       
    }
        else {
           axios.post('/api/collection/create', {"user": user.id, "recipe": recipe_id})
            .then( (res) => {
                setCollect(true)
                console.log(res.data.id)
                setCollectionId(res.data.id)
                console.log(collectionId)
                dispatch(setMessage({
                     "info": "Add to Collection Successful",
                      "type": "success"
                  }))
                })
            .catch((error) => {
              console.log(error)
            
            })
        }
      }
  }

  const handleReport = ()=>{
    setReport(!report)
    
  }
  

  const toProfile = (index) => {
        navigate("/profile/" + index)
    }
  

  return (
    <Container sx = {{paddingTop: 5}}>
      <Container>
    <Stack direction="row" spacing={2} style={{width:"25%"}}>
       
      <Avatar src={avatar}>
      {/* <PersonIcon/> */}
      </Avatar>
      <Link onClick={() =>toProfile(id)} color="inherit" underline="hover">
        <Typography variant={"subtitle1"} noWrap>
          {author}
        </Typography>
      </Link>
    </Stack>
    <Stack direction = "row" spacing={1} sx = {{paddingLeft: "75%", position: "flexible"}} style={{width:"10%"}} >
    <IconButton onClick={handleLike}>
    {like ? <ThumbUpAltIcon color="error" /> : <ThumbUpAltIcon  />}  
           
    </IconButton> 
    <IconButton onClick={handleCollect}>
    {collect ? <LibraryAddIcon color="warning" /> : <LibraryAddIcon />}  
      
      </IconButton>
      {/* <IconButton onClick={handleReport}>
      {report ? <ReportIcon color="success" /> : <ReportIcon />}  
      
      </IconButton> */}

      {follow?<Button 
      
      color="primary"
      display="block"
      style={{maxWidth: '30px'}}
      onClick={handleFollow}
      sx={{ mr: 1 }}

      >
          Unfollow
          </Button>:
          <Button 
          variant="contained"
          color="primary"
          display="block"
          style={{width:"15%"}}
          onClick={handleFollow}
          sx={{ mr: 1 }}
    
          >
              Follow
          </Button>
      }
       
    
      
    </Stack>
    </Container>
    <Container>
    <Typography variant="h5" component="div"> Recipe Discription: </Typography>
    <Typography variant="h7" component="div"> {description}    </Typography>
    </Container>
    </Container>
  );
}
