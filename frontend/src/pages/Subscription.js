import {Container, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import SubscribeTable from "../components/mainpage/subscribe/SubscribeTable.js";
import { Box, Button, ButtonGroup, styled } from "@mui/material";
import { useState } from "react";
import FollowersTable from "../components/mainpage/subscribe/FollowersTable.js";
import {useLocation, useParams} from "react-router-dom";

/**
 * A page for user manage their following user and followers
 */
const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(10)
    },

    box: {
        paddingTop: theme.spacing(5)
    },

    group: {
        paddingTop: theme.spacing(10),
        width: "100%",
    },
}))

const Subscription = () => {
    const { state } = useLocation()
    const classes = useStyles();
    const [selectedTable, setSelectedTable] = useState(state.index)

    const GroupButton = styled(Button)({
        width: "50%",
        color: "#5B646E",
        borderColor: "#5B646E",
        '&:hover': {
            color: "white",
            backgroundColor: '#a8b3bf',
            border: 'none'
        },
    })

    const FocusButtonStyle = styled(Button)({
        width: "50%",
        backgroundColor: "#5B646E",
        color: "white",
        border: 'none', 
        '&:hover': {
            color: "white",
            backgroundColor: '#a8b3bf',
        },  
    })

    return (
        <Container className={classes.root}>

            <ButtonGroup className={classes.group}>
                {selectedTable===0 && 
                    <div sx={{width: "100%"}}>
                    <FocusButtonStyle onClick={e => setSelectedTable(0)}>
                        Following
                    </FocusButtonStyle>
                    <GroupButton variant="outlined" onClick={e=> setSelectedTable(1)}>
                        Followers
                    </GroupButton>
                    </div>
                }
                {selectedTable===1 && 
                    <div sx={{width: "100%"}}>
                    <GroupButton variant="outlined" onClick={e => setSelectedTable(0)}>
                        Following
                    </GroupButton>
                    <FocusButtonStyle onClick={e=> setSelectedTable(1)}>
                        Followers
                    </FocusButtonStyle>
                    </div>
                }
            </ButtonGroup>
            <Box className={classes.box}>
                {selectedTable === 0 && <SubscribeTable userId={state.id}/>}
                {selectedTable === 1 && <FollowersTable userId={state.id}/>}
            </Box>

        </Container>
    )
}

export default Subscription