import {Icon} from "../profile/Info";
import {Button, Container, Modal, Stack, TextField} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { update } from "../../redux/userSlice";
import axios from "axios";
import {setMessage} from "../../redux/messageSlice";
import React from 'react';

/**
 * Component for update user information
 */
const Title = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "20px",
    fontSize: "25px",
    fontWeight: 400,
})

const Modify = styled('div')({
    display: "flex",
    flexDirection: "column",
})

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(5)
    },
    top: {
        display: 'flex',
        paddingLeft: theme.spacing(2)
    },
    button: {
        borderRadius: "50%",
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    container: {
        backgroundColor: "white",
        position: "absolute",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        [theme.breakpoints.down("sm")]: {
            width: "100vw",
            height: "100vh",
        },
    },
    action: {
        width: "50px"
    }


}))

const ModifySection = () => {
    const user = useSelector( (state) => state.user.userInfo)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [updateDescription, setUpdateDescription] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmError, setConfirmError] = useState(false)
    const [emailHelper, setEmailHelper] = useState('')
    const [passwordHelper, setPasswordHelper] = useState('')
    const [confirmHelper, setConfirmHelper] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [file, setFile] = useState(null)
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fileInput = useRef(null)
    const classes = useStyles()


    useEffect(() => {
        setEmail(user.email)
        setUpdateDescription(user.description)
        setImageUrl(user.avatar)
    }, [user])


    const uploadAvatar = (event) => {
        setFile(event.target.files[0])
        setImageUrl(URL.createObjectURL(event.target.files[0]))
        fileInput.current.value = ''
        setOpen(false)
    }

    const handleUpdate = () => {
        if (passwordError || confirmError){
            return;
        }

        if (password !== confirm){
            dispatch(setMessage({
                "info": "password and confirm password are the same",
                "type": "error"
            }))
        } else  {
            // if it has new file input, send it to the file server first
            // then passing the url to backend.
            if ( file != null) {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    axios
                        .post("/api/upload",
                            {
                                filename:file.name,
                                content: reader.result,
                                username: user.name
                            })
                        .then((res) => {
                            updateUserInfo(res.data.fileUrl);
                        })
                        .catch((error) => {
                            console.log(error)
                            dispatch(
                                setMessage({
                                    "info": "Upload avatar failed",
                                    "type": "error"
                                })
                            )
                        })
                    }
            } else{
                updateUserInfo(imageUrl)
            }
        }
    }

    const updateUserInfo = (image) => {
        axios({
                url: "/api/user/update",
                method: "post",
                data: {
                    id: user.id,
                    first_name: '',
                    last_name: '',
                    email: email,
                    avatar: image,
                    password: password,
                    description: updateDescription
                }
            })
                .then((res) => {
                    dispatch(update({
                        "name": user.name,
                        "id": user.id,
                        "email":email,
                        "avatar": image,
                        "description": updateDescription
                    }));
                    dispatch(setMessage({
                        "info": "Update user information successful",
                        "type": "success"
                    }))
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(
                        setMessage({
                            "info": "Update user information fail",
                            "type": "error"
                        })
                    )
                })
    }


    const checkName = (event) => {
        if (event.target.value === null || event.target.value === ""){
            setEmailError(true);
            setEmailHelper("Email address cannot be empty");
        } else {
            setEmailError(false);
            setEmailHelper('');
        }
        setEmail(event.target.value);
    }

    const checkPassword = (event) => {
        if (event.target.value === null || event.target.value === ""){
            setPasswordError(true);
            setPasswordHelper("Password cannot be empty");
        } else {
            setPasswordError(false);
            setPasswordHelper('');
        }
        setPassword(event.target.value);
    }

    const checkConfirm = (event) => {
        console.log(event.target.value === password)
        if (event.target.value === null || event.target.value === "" && event.target.value != password){
            setConfirmError(true);
            setConfirmHelper("Confirm password cannot be empty");
        } else {
            setConfirmError(false);
            setConfirmHelper('');
        }
        setConfirm(event.target.value);
    }

    const checkDescription = (event) => {
        setUpdateDescription(event.target.value)
    }


    return(
        <div>
            <Modal open={open}>
                <Container className={classes.container} maxWidth={"xs"}>
                    <Stack
                        direction={"column"}
                        justifyContent={"space-between"}
                    >
                         <Button
                             onClick={() =>{fileInput.current.click()}}
                         >
                            upload avatar
                        </Button>
                        <Button
                            onClick={handleClose}
                            color={"error"}
                        >
                            cancel
                        </Button>
                    </Stack>
                </Container>
            </Modal>

            <Container className={classes.root}>
            <div className={classes.top}>
                <button onClick={handleOpen} className={classes.button}>
                    <Icon src={imageUrl}/>
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/gif,image/jpeg,image/jpg,image/png"
                        hidden
                        onChange={uploadAvatar}
                    />
                </button>

                <Title>
                    {user.name}
                </Title>
            </div>

            <Modify>
                <TextField
                    margin={"normal"}
                    label={"Email address"}
                    value={email}
                    required
                    error={emailError}
                    helperText={emailHelper}
                    onChange={checkName}
                />

                <TextField
                    margin={"normal"}
                    label={"Password"}
                    type={"password"}
                    onChange={checkPassword}
                    required
                    error={passwordError}
                    value={password}
                    helperText={passwordHelper}
                />

                <TextField
                    margin={"normal"}
                    label={"Confirm password"}
                    type={"password"}
                    error={confirmError}
                    onChange={checkConfirm}
                    helperText={confirmHelper}
                    value={confirm}
                    required
                />

                <TextField
                    margin={"normal"}
                    label={"Description"}
                    multiline
                    value={updateDescription}
                    onChange={checkDescription}
                />
            </Modify>

            <Stack direction={"row"} justifyContent={"flex-end"}>
                <Button variant={"contained"} onClick={handleUpdate}>
                    Submit
                </Button>
            </Stack>
        </Container>
        </div>
    )
}

export default ModifySection