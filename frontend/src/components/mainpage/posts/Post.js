import {makeStyles, styled} from "@mui/styles";
import {Avatar, Box, Card, IconButton, Link, Stack, Typography} from "@mui/material";
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import SharePopover from "./SharePopover";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useEffect, useState} from "react";
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import axios from "axios";
 
const RecipeImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
})

const useStyles = makeStyles((theme) => ({
    header: {
        margin: theme.spacing(1)
    },
    avatar: {
        marginRight: theme.spacing(1),
        display: "flex",
        marginTop: 2,
        cursor:"pointer"
    },
    root: {
        minHeight: 600,
    }
}))

// create the component Post, which is the card display in mainpage.
export default function Post(props){
    const classes = useStyles();
    const {author_id, name, description, img_url, id} = props;
    const navigate = useNavigate()
    const [author, setAuthor] = useState('')
    const [avatar,setAvatar] = useState('')
    const getUserDetails = () =>{
         axios
            .get("/api/user/get?id=" + author_id)
            .then((res) => {
                setAuthor(res.data.username)
                setAvatar(res.data.avatar)
                
            })
            .catch((error) => console.log(error))
    }

    const toProfile = (index) => {
        navigate("/profile/" + index)
    }

    useEffect(() => {
        getUserDetails()
    }, [author_id])
//the components of the post 
    return (
        <Card className={classes.root}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                className={classes.header}
            >
                <Stack
                    direction={"row"}
                >
                    <Link onClick={() => toProfile(author_id)} color="inherit" underline="hover">
                    <Avatar src={avatar} className={classes.avatar}/>
                    </Link>
                    <Stack direction={"column"}>
                        <Link onClick={() => toProfile(author_id)} color="inherit" underline="hover">
                            <Typography variant={"subtitle2"} noWrap>
                               {author}
                            </Typography>
                        </Link>

                        <Typography variant={"subtitle1"}>
                            {name}
                        </Typography>
                    </Stack>
                </Stack>

                <SharePopover recipeId={id}/>
            </Stack>

            <Box sx={{ pt: '100%', position: 'relative'}}>
            <Link to={`/recipe/${id}`} color="inherit" underline="hover" component={RouterLink}>
               
                <RecipeImg 
                src={img_url} 
                />
            </Link>
                <Stack
                    direction={"row"}
                    justifyContent={"flex-end"}
                >
                </Stack>
            </Box>

            <Stack sx={{ p: 3 }} justifyContent={"center"}>
                <Typography variant="subtitle2">
                {description}
                </Typography>
            </Stack>
        </Card>
    )
}
