/*!
 * This file is the sign up page
 * New users can create their account here.
 * 
 */
import React, {useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    CssBaseline,
    Grid,
    Link,
    Paper,
    TextField,
    Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useDispatch} from "react-redux";
import {setMessage} from "../redux/messageSlice";
const axios = require('axios');
let verifycd;

const Register = () => {
    const [generateCode, setGenerateCode] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const [emailActive, setEmailActive] = useState(false);
    const [codeActive, setCodeActive] = useState(true);
    const [passwordActive, setPasswordActive] = useState(true);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [codeError, setCodeError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [usernameError, setUsernameError] = useState(false);

    const [emailDes, setEmailDes] = useState('');
    const [passwordDes, setPasswordDes] = useState('');
    const [codeDes, setCodeDes] = useState('');
    const [confirmPasswordDes, setConfirmPasswordDes] = useState('');
    const [usernameDes, setUsernameDes] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (emailAddress === ''){
            setEmailError(true);
            setEmailDes("Email address cannot be empty");
        }

        if (password === ''){
            setPasswordError(true);
            setPasswordDes("password cannot be empty");
        }

        if (emailAddress !== '' && password !== ''){
            setEmailError(false);
            setPasswordError(false);
        }

        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console
    };

    const checkPassword = (event) => {
        console.log(event.target.value);
        if (event.target.value === null || event.target.value === ""){
            setPasswordError(true);
            setPasswordDes("password cannot be empty");
        } else {
            setPassword(event.target.value);
            setPasswordError(false);
            setPasswordDes("");
        }
    }

    const handleCHangeConfirmPassword = (event) => {
        if (event.target.value === null || event.target.value === ""){
            setConfirmPasswordError(true);
            setConfirmPasswordDes("comfirm password cannot be empty");
        } else if (event.target.value !== password) {
            setConfirmPasswordError(true);
            setConfirmPasswordDes("passwords does not match");
        } else {
            setConfirmPassword(event.target.value);
            setConfirmPasswordError(false);
            setConfirmPasswordDes("");
        }
    }

    const handleChangeCode = (event) => {
        setVerifyCode(event.target.value);
    }

    const handleUsername = (event) => {
        setUsername(event.target.value);
    }

    /*!
    * This function is used to check whether user has entered an email with the right format
    */
    const handleChangeEmail = (event) => {
        if (event.target.value !== ''){
            let Regex = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
            if (!Regex.test(event.target.value)){
                setEmailError(true);
                setEmailDes("Wrong Email Format");
            } else {
                setEmailAddress(event.target.value);
                setEmailError(false);
                setEmailDes('');
            }
        } else {
            setEmailError(true);
            setEmailDes('Email address cannot be empty');
        }
    }

    /*!
    * This function is used to call the send verify email model in the backend
    * Every time a new user sign up need to verify email.
    */
    const sendEmail = () => {
        let newCode = ''

        if (emailError) {
            return;
        }
        //send email
        
        let data = {"email": emailAddress};
        console.log(data)

        axios.post('/api/sendemail', data)
            .then(res => {
                newCode = res.data.code;
                setGenerateCode(newCode);
                verifycd = newCode;
                setEmailActive(true)
                setCodeActive(false)
                dispatch(
                    setMessage({
                        "info": "A verification email has benn send",
                        "type": "success"
                    })
                )
            })
            .catch(err => {
                console.log(err.data)
                dispatch(
                    setMessage({
                        "info": "Fail to send verification email",
                        "type": "error"
                    })
                )
            });
        
        return;
    }

    const handleVerify = (e) => {
        if (verifycd === verifyCode) {
            setCodeActive(true);
            setPasswordActive(false);
        }
    }

    /*!
    * This function is used to deal with the final sign up
    * All the user info would be sent to backend and finish new user signed up
    */
    const signup = () => {
        if ((password !== confirmPassword) && password === '' && confirmPassword === '') {
            return;
        }

        let userInfo = {
            username: username,
            password: password,
            email: emailAddress,
            first_name: 'firstname',
            last_name: 'lastname',
        }

        if ((password === confirmPassword) && password !== '' && confirmPassword !== '') {
            axios.post("/api/user/create",userInfo).then(
                (res)=>{
                    setUsernameError(false);
                    setUsernameDes("");
                    setPasswordActive(true)
                    dispatch(setMessage({"info": "Username Create Success", "type": "success"}))
                    navigate('/login')
                }
            ).catch((err)=>{
                console.log("upload fail");
                setUsernameError(true);
                setUsernameDes("Username already exist");
            });
        }
    }



    return(
        <div>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Register
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e)=>{handleChangeEmail(e)}}
                                error={emailError}
                                helperText={emailDes}
                                disabled = {emailActive}
                            />
                            
                            <Button
                                fullWidth
                                color={"success"}
                                variant={"contained"}
                                onClick={() => {sendEmail()}}>
                                send verify email
                            </Button>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="code"
                                label="VerifyCode"
                                type="code"
                                id="code"
                                autoComplete="code"
                                onChange={handleChangeCode}
                                error={codeError}
                                helperText={codeDes}
                                disabled = {codeActive}
                            />


                            <Button
                                fullWidth
                                disabled = {codeActive}
                                color={"success"}
                                variant={"contained"}
                                onClick={() => {handleVerify()}}>
                                Verify
                            </Button>


                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="username"
                                label="username"
                                type="username"
                                id="username"
                                autoComplete="current-username"
                                onChange={handleUsername}
                                error={usernameError}
                                helperText={usernameDes}
                                disabled = {passwordActive}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={checkPassword}
                                error={passwordError}
                                helperText={passwordDes}
                                disabled = {passwordActive}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="Cpassword"
                                label="Confirm Password"
                                type="password"
                                id="Cpassword"
                                autoComplete="confirm-password"
                                onChange={handleCHangeConfirmPassword}
                                error={confirmPasswordError}
                                helperText={confirmPasswordDes}
                                disabled = {passwordActive}
                            />

                            <Button
                                fullWidth
                                type={"submit"}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled = {passwordActive}
                                onClick = {() => {signup()}}
                            >
                                Sign Up
                            </Button>

                            <Grid container justifyContent={"flex-end"}>
                                <Grid item>
                                    {/* Change current page to register page */}
                                    <Link underline="none" component={RouterLink} variant="body2" to={"/login"}>
                                        {"Already have an account? Log in"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default Register