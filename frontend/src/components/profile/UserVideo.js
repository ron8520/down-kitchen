import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setMessage} from "../../redux/messageSlice";
import {makeStyles} from "@mui/styles";
import ReactPlayer from "react-player";
import React from "react";
import Container from "@mui/material/Container";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import {IconButton, Typography} from "@mui/material";

const Video = styled.div`
    justify-content: center;
    margin: auto;
    width: 40%;
    height: auto%;
    padding-bottom: 5%;
    object-fit: cover;
`

const useStyles = makeStyles((theme) => ({
    root: {
    },
    container: {
        padding: theme.spacing(3),
        paddingTop: theme.spacing(5)
    },
    vid: {
        margin: 'auto',
    },

    container:{
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(2),
        maxHeight: 150
    }
}))

const UserVideo = (props) => {
    const { getData, rows, userId } = props
    const classes = useStyles()
    const user = useSelector((state) => (state.user.userInfo))
    const dispatch = useDispatch()

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
    return(
        <Container className={classes.root}>
            {rows.length === 0 && (
                <Container className={classes.container}>
                    <Typography variant={"h5"} sx={{textAlign: 'center'}}>
                        Not upload any videos yet !
                    </Typography>
                </Container>
            )}
            {rows.map(item =>(item.img_url.includes('mp4') && (
                <Video>
                    {userId == user.id && (
                        <IconButton onClick={() => handleDelete(item.id)}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                    <Container className={classes.container}>
                        <ReactPlayer width={"100%"} height={"100%"} url={item.img_url} className={classes.vid} controls/>
                    </Container>
                </Video>
            )))}
        </Container>
    )
}

export default UserVideo