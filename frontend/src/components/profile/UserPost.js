import {Grid, IconButton, Typography, Container} from "@mui/material";
import {makeStyles} from "@mui/styles";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCommentIcon from '@mui/icons-material/AddComment';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import styled from "styled-components";
import {Number} from "./UserMoment";
import axios from "axios";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setMessage} from "../../redux/messageSlice";
import {useNavigate} from "react-router-dom";

export const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.justifyContent};
  align-item: ${(props) => props.alignItems};
  opacity: 0;
  transition: all 0.5s ease;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
`;

export const Image = styled.img`
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
`;

export const SubContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
    padding-bottom: 10%;
     cursor: pointer;
`;

export const NormalContainer = styled.div`
    align-items: center;
    justify-content: center;
    height: 100%;
    alignItems: center;
    display: flex;
    padding-bottom: 10%;
    cursor: pointer;
`

export const Action = styled.div`
    justify-content: space-between;
    display: flex;
`;

export const Card = styled.div`
    position: relative;
    padding-top: 100%;
    &:hover ${Info}{
    opacity: 1;
    }
`

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

const UserPost = (props) => {
    const { rows, getData, userId, getCollection } = props
    const classes = useStyles()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => (state.user.userInfo))

    const handleDelete = (id) => {
        axios
            .delete('/api/recipe/delete', {data:{"recipe_id": id}})
            .then((res) => {
                    getData();
                    getCollection();
                    dispatch(setMessage({"info": "Delete Recipe successful", "type": "success"}));
                })
            .catch((error) => {
                console.log(error);
                dispatch(setMessage({"info": "Delete Recipe Fail, try again later!", "type": "error"}));
        })
    }

    const handleClick = (id) => {
        navigate("/recipe/"+id)
    }

    return (
            <Grid container spacing={3} className={classes.root}>
                {rows.length === 0 ? (
                <Container className={classes.container}>
                    <Typography variant={"h5"} sx={{textAlign: 'center'}}>
                        Not upload any posts yet !
                    </Typography>
                </Container>
                ):(
                    (rows.map((item) => (
                        userId == user.id ? (
                            <Grid key={item.id} item md={4} xs={12}>
                                <Card>
                                    <Image src={item.img_url} />
                                    <Info>
                                        <Action>
                                            <IconButton
                                                color={"inherit"}
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Action>

                                        <NormalContainer onClick={() => handleClick(item.id)}>
                                            {item.status === 'A' && (
                                                <Number>
                                                    <FavoriteBorderIcon sx={{width: '25px', height: '25px'}}/>
                                                    &nbsp;&nbsp;
                                                    {item.likes}
                                                </Number>
                                            )}
                                            {item.status === 'P' && (
                                                 <AccessTimeOutlinedIcon
                                                    sx={{width:'50px', height: '50px'}}
                                                    color={"inherit"}
                                                />
                                            )}
                                            {item.status === 'D' && (
                                                <WarningIcon
                                                    sx={{width:'50px', height: '50px'}}
                                                    color={"inherit"}
                                                />
                                            )}
                                        </NormalContainer>
                                    </Info>
                                </Card>
                            </Grid>
                        ) : (
                            item.status === 'A' &&(
                                <Grid key={item.id} item md={4} xs={12}>
                                <Card>
                                    <Image src={item.img_url} />
                                    <Info justifyContent={"center"}>
                                        <SubContainer onClick={() => handleClick(item.id)}>
                                            <Number>
                                                <FavoriteBorderIcon sx={{width: '25px', height: '25px'}}/>
                                                &nbsp;&nbsp;
                                                {item.likes}
                                            </Number>
                                            &nbsp;&nbsp;
                                        </SubContainer>
                                    </Info>
                                </Card>
                            </Grid>
                                ))
                    ))))}
            </Grid>
    )
}

export default UserPost