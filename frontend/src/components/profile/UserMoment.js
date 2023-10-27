import {Grid, IconButton, Typography, Container} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {useEffect, useState} from "react";
import axios from "axios";
import {Action, Card, Image, Info, SubContainer} from "./UserPost";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {setMessage} from "../../redux/messageSlice";
import {useDispatch, useSelector} from "react-redux";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WarningIcon from "@mui/icons-material/Warning";

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

export const Number = styled.div`
    justify-content: center;
    font-size: 25px;
    padding-top: 1%;
`

const UserMoment = (props) => {
    const { getData, rows, userId } = props
    const classes = useStyles()
    const dispatch = useDispatch()
    const user = useSelector((state) => (state.user.userInfo))

    const handleDelete = (id) => {
        const data = {
            "moment_id": id
        }
        axios
            .delete("/api/moment/delete", {data})
            .then((res) => {
                getData()
                dispatch(setMessage({"info": "Delete Moment successful", "type": "success"}))
            })
            .catch((error) => {
                console.log(error)
                dispatch(setMessage({"info": "Delete Moment Fail, please try again later!", "type": "error"}))
            })
    }

    return (
        <Grid container spacing={3} className={classes.root}>
            {rows.length === 0 ? (
                <Container className={classes.container}>
                    <Typography variant={"h5"} sx={{textAlign: 'center'}}>
                        Not upload any Moment yet !
                    </Typography>
                </Container>
            ) : (
                rows.map(item =>(
                    !item.img_url.includes('mp4') &&
                    <Grid key={item.id} item md={4} xs={12}>
                        <Card>
                            <Image src={item.img_url} />
                            {user.id == userId ? (
                                <Info>
                                    <Action>
                                        <IconButton color={"inherit"} onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Action>
                                <SubContainer>
                                    <FavoriteBorderIcon
                                        sx={{width: '50px', height: '50px'}}
                                        color={"inherit"}
                                    />
                                    &nbsp;&nbsp;
                                    <Number>
                                        {item.likes}
                                    </Number>
                                </SubContainer>
                            </Info>
                            ): (
                                <Info justifyContent={"center"}>
                                <SubContainer>
                                    <FavoriteBorderIcon
                                        sx={{width: '50px', height: '50px'}}
                                        color={"inherit"}
                                    />
                                    &nbsp;&nbsp;
                                    <Number>
                                        {item.likes}
                                    </Number>
                                </SubContainer>
                            </Info>
                            )}

                        </Card>
                    </Grid>
                )))}
        </Grid>
    )
}

export default UserMoment;