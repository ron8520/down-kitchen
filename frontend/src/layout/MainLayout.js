import {Outlet} from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { CssBaseline, Grid} from "@mui/material";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import React from "react";
import {makeStyles} from "@mui/styles";

/**
 * Main layout
 */
const useStyles = makeStyles((theme) => ({
    right: {
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
}))


const MainLayout = () => {
    const classes = useStyles();

    return (
        <div>
            <Navbar />
            {/* Children element */}
            <Grid container>
                <CssBaseline />
                <Grid item sm={2} xs={2}>
                    <LeftSide />
                </Grid>

                <Grid item sm={8} xs={10}>
                    <Outlet />
                </Grid>

                <Grid item sm={2} className={classes.right}>
                    <RightSide />
                </Grid>
            </Grid>
        </div>
    )
}

export default MainLayout;