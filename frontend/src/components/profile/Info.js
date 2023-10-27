import {makeStyles, styled} from "@mui/styles";
import {Button, Link, Stack, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {setMessage} from "../../redux/messageSlice";

/**
 * Component for display user information: username, avatar, followers number, subscribe number
 *
 */
const Description = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(5),
    height: '30px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 400,
}))

export const Icon = styled('img')((theme) => ({
    top: 0,
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '50%'
}))

export const IconButton = styled('button')((theme) => ({
    backgroundColor: "transparent",
    borderRadius: '50%',
    borderColor: "transparent"
}))


const useStyles = makeStyles((theme) => {
    return {
        root:{
            display: "flex",
            width: '100%',
            alignItems: 'center',
            marginBottom: theme.spacing(6)
        },
        left: {
            display: "flex",
            flexDirection: "column",
            width: "20%",
            alignItems: "center"
        },
        right: {
            padding: theme.spacing(5),
            flexDirection: "column",
            width: '100%'
        },
        name: {
            paddingRight: theme.spacing(5)
        },
        nameSection: {
            paddingTop: theme.spacing(5)
        },
        avatar: {
            height: '50px',
            width: '50px',
            borderRadius: '50%'
        },
        details: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(5)
        }
    }

})

const Info = (props) => {
    const { onSelect, userId, recipeNum, momentNum } = props
    const [username, setUsername] = useState('')
    const [description, setDescription] = useState('')
    const [avatar, setAvatar] = useState('/assets/gril.png')
    const [isFollowed, setIsFollowed] = useState(false)
    const [subscribe, setSubscribe] = useState(0)
    const [following, setFollowing] = useState(0)
    const classes = useStyles()
    const navigate = useNavigate()
    const user = useSelector( (state) => state.user.userInfo)
    const dispatch = useDispatch()

    const getUserFollows = () => {
         axios
            .get("/api/sub/follow/?user_id=" + userId)
            .then((res) => {
                setSubscribe(res.data.users.length)
            })
            .catch((error) => console.log(error))
    }

    const getUserSubscribe = () => {
        axios
            .get("/api/sub/subscribe/?user_id=" + userId)
            .then((res) => {
                setFollowing(res.data.users.length)
            })
            .catch((error) => console.log(error))
    }

    const getUserDetails = () =>{
         axios
            .get("/api/user/get?id=" + userId)
            .then((res) => {
                setUsername(res.data.username)
                setDescription(res.data.description)
                setAvatar(res.data.avatar)
            })
            .catch((error) => console.log(error))
    }

    const userFollow = () => {
        if (user.id === null) {
            navigate("/login")
        } else {
             axios
                .post('/api/sub/create', {"user": userId, "follow": user.id})
                .then((res) => {
                    getUserFollows()
                    setIsFollowed(true)
                    dispatch(
                        setMessage({
                            "info": "Follow successful",
                            "type": "success"
                        })
                    )
                })
                .catch((error) => {
                    console.log(error)
                    dispatch(
                        setMessage({
                            "info": "Follow fail",
                            "type": "error"
                        })
                    )
                })
        }
    }

    // user.id is current login user ID
    const userUnfollow = () => {
        axios
            .delete('/api/sub/delete', { data: {"user": userId, "follow": user.id}})
            .then((res) => {
                setIsFollowed(false)
                getUserFollows()
                dispatch(
                        setMessage({
                            "info": "Unfollow successful",
                            "type": "success"
                        })
                    )
            })
            .catch((error) => {
                console.log(error)
                dispatch(
                        setMessage({
                            "info": "Unfollow Fail",
                            "type": "error"
                        })
                    )
            })
    }

    //To check the current user has follow the user or not
    //userId: target user Id
    const getUserIsFollowed = () => {
        axios
            .post('/api/sub/get',  {"user": userId})
            .then((res) => {
                for(var i = 0; i < res.data.length; i++){
                    if (res.data[i].fields.follow == user.id){
                        setIsFollowed(true)
                        break;
                    }
                }

            })
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        getUserFollows()
        getUserSubscribe()
        getUserDetails()
        getUserIsFollowed()
    }, [userId])


    return (
        <div className={classes.root}>
            <div className={classes.left}>
                <IconButton>
                    <Icon src={avatar === '' ? '/assets/gril.png' : avatar}/>
                </IconButton>
            </div>

            <div className={classes.right}>
                <Stack direction={"row"} className={classes.nameSection}>
                    <Typography variant={"h5"} className={classes.name}>
                        {username}
                    </Typography>

                    {user.id == userId ? (
                       <Button variant={"outlined"} onClick={(e) => {navigate("/setting")}}>
                            Edit Profile
                        </Button>
                    ): (
                        isFollowed ?
                        <Button variant={"outlined"} onClick={userUnfollow}>
                            UnFollow
                        </Button>
                            :
                            <Button variant={"outlined"} onClick={userFollow}>
                                Follow
                            </Button>
                    )}
                </Stack>

                <Stack className={classes.details} direction={"row"} justifyContent={"space-between"}>
                    <Link color="inherit" underline="hover" onClick={() => onSelect("posts")}>
                        <Typography variant={"h7"}>
                            {recipeNum} recipes
                        </Typography>
                    </Link>

                    <Link onClick={() => onSelect("moments")} color="inherit" underline="hover">
                        <Typography variant={"h7"}>
                            {momentNum} moments
                        </Typography>
                    </Link>

                        <Typography variant={"h7"}>
                            {subscribe} followers
                        </Typography>


                        <Typography variant={"h7"}>
                            {following} subscribing
                        </Typography>
                </Stack>

                <Description>
                    { description === '' ? (
                        <Typography variant={"subtitle1"}>
                            Does not have any description yet
                        </Typography>
                    ) : (
                        description
                        )}
                </Description>
            </div>
        </div>
    )
}

export default Info