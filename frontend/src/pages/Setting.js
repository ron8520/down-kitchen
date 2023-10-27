import {Container, Typography} from "@mui/material";
import { makeStyles} from "@mui/styles";
import ModifySection from "../components/setting/ModifySection";

/**
 * A page for current login user update their personal information
 * include avatar, email, password and description
 */
const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(15)
    }
}))

const Setting = () => {
    const classes = useStyles()

    return (
        <Container className={classes.root}>
            <Typography variant={"h4"}>
                Setting
            </Typography>

            <ModifySection/>
        </Container>
    )
}

export default Setting