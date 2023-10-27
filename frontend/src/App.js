import React, {useEffect} from 'react';
import ScrollToTop from "./components/ScrollToTop";
import Router from "./routes";
import {Alert, createTheme, Snackbar, ThemeProvider} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {close} from "./redux/messageSlice";
import axios from 'axios'
import {update} from "./redux/userSlice";
const theme = createTheme()

function App() {
    const dispatch = useDispatch();
    const message = useSelector((state) => state.message);

    const handleClose = (event, reason) => {
        if (reason === "clickaway"){
            return;
        }
        dispatch(close());
    }


    useEffect(() => {
        axios
            .get("/api/userinfo")
            .then(res => {
            //Set up token and update on the information on userSlice
            if(res.status === 200) {
                dispatch(
                    update({
                        "name":res.data.username,
                        "id": res.data.id,
                        "email": res.data.email,
                        "avatar": res.data.avatar,
                        "description": res.data.description,
                }));
            }})
            .catch(err => {
                console.log(err)
            })
        }, [])
  return (
    <ThemeProvider theme={theme}>
        <ScrollToTop />
        <Router />
        <Snackbar
            open={message.open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={handleClose} severity={message.type}>
                {message.info}
            </Alert>
        </Snackbar>
    </ThemeProvider>
  );
}

export default App;
