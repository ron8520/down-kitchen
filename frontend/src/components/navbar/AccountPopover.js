import {Box, Button, IconButton, MenuItem, Popover} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/userSlice";
import {setMessage} from "../../redux/messageSlice";
import axios from 'axios'

const AccountPopover = () => {
    const user = useSelector((state) => (state.user))
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('isLogin') === "true"){
            setIsLogin(true)
        }
    })

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    //Handle page change logic
    const handleChangePage = (path) => {

        if( path === '/profile'){
            if (localStorage.getItem('isLogin') === "false") {
                navigate('/login')
            } else {
                navigate('/profile/' + user.userInfo.id);
            }
        }

        if (path === '/subscription'){
            if (localStorage.getItem('isLogin') === "false") {
                navigate('/login')
            } else {
                navigate(path, {state: {index: 0, id: user.userInfo.id}})
            }

        }

        if (path === '/setting'){
            if (localStorage.getItem('isLogin') === "false") {
                navigate('/login')
            } else {
                navigate(path)
            }
        }
        handleClose();
    }

    const redirectToLoginPage = () => {
        navigate("/login");
        handleClose();
    }

    const redirectToLogOutPage = () => {
        navigate("/");
        axios.get("/api/logout").then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
        dispatch(logout());
        dispatch(setMessage({"info": "Log out Successful", "type": "success"}))
        localStorage.setItem('isLogin', "false")
        setIsLogin(false)
        handleClose();
    }


    const menuItem = [
        {
            text: "Profile",
            icon: <PersonIcon color={"primary"}/>,
            path: "/profile"
        },
        {
            text: "Subscription",
            icon: <CollectionsBookmarkIcon color={"primary"}/>,
            path: "/subscription"

        },
        {
            text: "Setting",
            icon: <SettingsIcon color={"primary"}/>,
            path: "/setting"

        }
    ]

    const open = Boolean(anchorEl);
    const id = open ? 'account-popover' : undefined;

    return (
        <div style={{display: 'inline'}}>
            <IconButton
                onClick={handleOpen}
                aria-describedby={id}
                color="inherit"
            >
                <AccountCircle/>
            </IconButton>

            <Popover
                open={open}
                id={id}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    style: {
                        width: 200
                    }
                }}
            >
                <Box sx={{
                    mr: 2,
                    width: 24,
                    height: 18
                }}/>

                {menuItem.map(item => (
                    <div key={item.text}>
                        <MenuItem onClick={() => handleChangePage(item.path)} disableRipple>
                            {item.icon}
                            <Box sx={{
                                mr: 2,
                                width: 24,
                                eight: 24
                            }}/>

                            {item.text}
                        </MenuItem>

                        <Box sx={{
                            mr: 2,
                            width: 24,
                            height: 18
                        }} />
                    </div>
                ))}

                <Box sx={{p:2, pt: 1.5}}>
                    {!isLogin && (
                        <Button
                            fullWidth
                            color={"primary"}
                            variant={"outlined"}
                            onClick={redirectToLoginPage}
                        >
                            Log In
                        </Button>
                    )}


                    {isLogin &&(
                        <Button
                            fullWidth
                            color={"primary"}
                            variant={"outlined"}
                            onClick={redirectToLogOutPage}
                        >
                            Log Out
                        </Button>
                    )}
                </Box>
            </Popover>
        </div>
    )
}

export default AccountPopover;