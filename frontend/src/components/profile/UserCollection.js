import {Grid, IconButton, Typography, Container} from "@mui/material";
import {makeStyles} from "@mui/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import {Number} from "./UserMoment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddCommentIcon from "@mui/icons-material/AddComment";
import {Action, Card, Image, Info, NormalContainer} from "./UserPost";
import axios from "axios";
import {setMessage} from "../../redux/messageSlice";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const mockMenu = [
    {
        "_id": 1,
        "likes": 9999,
        "comment": 9999,
        "imageUrl": '/assets/bake.jpg',
        "status": "normal",
        "visibility": "public",
    },
    {
        "_id": 2,
        "likes": 300,
        "comment": 500,
        "imageUrl": '/assets/bake.jpg',
        "status": "report",
        "visibility": "public",
    },
    {
        "_id": 3,
        "likes": 100,
        "comment": 20,
        "imageUrl": '/assets/bake.jpg',
        "status": "process",
        "visibility": "public",
    }
]


const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(10)
    },

    container: {
        padding: theme.spacing(3),
        paddingTop: theme.spacing(6)
    }
}))


const UserCollection = (props) => {
    const { userId, getData, rows } = props
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state) => (state.user.userInfo))

    const handleClick = (recipeId) => {
        navigate('/recipe/' + recipeId)
    }

    const handleDelete = (id) => {
        axios
            .delete('/api/collection/delete', {data: {"collection_id": id}})
            .then((res) => {
                    getData()
                    dispatch(setMessage({"info": "Delete Collection successful", "type": "success"}));
                })
            .catch((error) => {
                console.log(error);
                dispatch(setMessage({"info": "Delete Collection Fail, try again later!", "type": "error"}));
        })
    }

    return (
        <Grid container spacing={3} className={classes.root}>
            {rows.length === 0 ? (
                <Container className={classes.container}>
                    <Typography variant={"h5"} sx={{textAlign: 'center'}}>
                        Not upload any collections yet !
                    </Typography>
                </Container>

            ) :
                rows.map(item => (
                <Grid item md={4} xs={12}>
                    <Card>
                        <Image src={item.img_url}/>
                        {user.id == userId ? (
                            <Info>
                                <Action>
                                    <IconButton color={"inherit"} onClick={() => handleDelete(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Action>

                                <NormalContainer onClick={() => handleClick(item.recipe_id)}>
                                    <Number>
                                        <FavoriteBorderIcon sx={{width: '25px', height: '25px'}}/>
                                        &nbsp;&nbsp;
                                        {item.likes}
                                    </Number>
                                </NormalContainer>
                            </Info>
                        ) : (
                            <Info justifyContent={"center"}>
                                <NormalContainer onClick={() => handleClick(item.recipe_id)}>
                                    <Number>
                                        <FavoriteBorderIcon sx={{width: '25px', height: '25px'}}/>
                                        &nbsp;&nbsp;
                                        {item.likes}
                                    </Number>
                                </NormalContainer>
                            </Info>
                        )}

                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export default UserCollection;