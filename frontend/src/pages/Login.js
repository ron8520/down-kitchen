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
import axios from 'axios'
import {useDispatch} from "react-redux";
import {login, update} from "../redux/userSlice";
import {setMessage} from "../redux/messageSlice";
import {Cookies} from "react-cookie";

/**
 * A page for user Login
 *
 */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameDes, setUsernameDes] = useState('');
    const [passwordDes, setPasswordDes] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit =  async (event) => {
        if (username === ''){
            setUsernameError(true);
            setUsernameDes("Username cannot be empty");
        }

        if (password === ''){
            setPasswordError(true);
            setPasswordDes("Password cannot be empty");
        }

        if (username !== '' && password !== ''){
            setUsernameError(false);
            setPasswordError(false);
        }

        const data = {
            "username": username,
            "password": password
        }
        await axios
            .post("/api/login", data)
            .then(res => {
                dispatch(
                    update({
                        "name":res.data.username,
                        "id": res.data.id,
                        "email": res.data.email,
                        "avatar": res.data.avatar,
                        "description": res.data.description,
                }));

                dispatch(setMessage({
                        "info": "Login in Successful",
                        "type": "success"
                    }));
                localStorage.setItem('isLogin', "true")
                console.log(localStorage.getItem('isLogin'))
                navigate('/')
            })
            .catch(err => {
                dispatch(
                        setMessage({
                            "info": "Username or password not match",
                            "type": "error"
                        })
                    )
                console.log(err.response)
            })
    };

    const checkUsername = (event) => {
        if (event.target.value === null || event.target.value === ""){
            setUsernameError(true);
            setUsernameDes("Username cannot be empty");
        } else {
            setUsernameError(false);
            setUsernameDes('');
        }
        setUsername(event.target.value);
    }

    const checkPassword = (event) => {
        if (event.target.value === null || event.target.value === ""){
            setPasswordError(true);
            setPasswordDes("password cannot be empty");
        } else {
            setPasswordError(false);
            setPasswordDes("");
        }
        setPassword(event.target.value);
    }

    const getCsrfToken = () => {
      const csrf = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
      return csrf ? csrf.pop() : '';
    };


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
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                onChange={checkUsername}
                                error={usernameError}
                                helperText={usernameDes}
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
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: "green"}}
                                onClick={e => handleSubmit()}
                            >
                                Sign In
                            </Button>

                            <Grid container justifyContent={"space-between"}>
                                <Grid item>
                                    <Link underline="none" component={RouterLink} variant="body2" to={"/"}>
                                        {"Back to Home page"}
                                    </Link>
                                </Grid>

                                <Grid item>
                                    {/* Change current page to register page */}
                                    <Link underline="none" component={RouterLink} variant="body2" to={"/register"}>
                                        {"Don't have an account? Sign Up"}
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

export default Login