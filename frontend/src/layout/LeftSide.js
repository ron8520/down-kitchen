import HomeIcon from '@mui/icons-material/Home';
import InstagramIcon from '@mui/icons-material/Instagram';
import {Container, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {makeStyles} from "@mui/styles";
import { useNavigate } from 'react-router-dom';

/**
 * Left side component, display the menu and handle switch page logic
 *
 */
const useStyles = makeStyles((theme) => ({
    text:{
        fontWeight: 500,
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    container:{
        height: "100vh",
        color: "white",
        paddingTop: theme.spacing(10),
        backgroundColor: theme.palette.primary.main,
        position: "sticky",
        top: 0,
        [theme.breakpoints.up("sm")]: {
            backgroundColor: "white",
            border: "1px solid #ece7e7",
        },
    },
    item:{
        display: "flex",
        alignItems: "center",
        minHeight: '5%',
        color: "#555",
        [theme.breakpoints.up("sm")]: {
            marginBottom: theme.spacing(3),
            cursor: "pointer",
        },
        '&:hover':{
            backgroundColor: 'rgb(30, 143, 255, 0.6)',
            color: "white",
        },
    },
    icon:{
        marginRight: theme.spacing(5),
        marginLeft: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            fontSize: "18px",
        },
    }
}))


const LeftSide = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const menuItem = [
        {
            text: "Home",
            icon: <HomeIcon className={classes.icon}/>,
            path: "/"
        },
        {
            text: "Gallery",
            icon: <InstagramIcon className={classes.icon} />,
            path: "/gallery"
        },
        {
            text: "Add Recipe",
            icon: <AddIcon className={classes.icon} />,
            path: "/createrecipe"
        }
    ]

    return (
        <div className={classes.container}>
            {menuItem.map(item => (
                <div key={item.text} className={classes.item} onClick={() => navigate(item.path)}>
                    {item.icon}
                    <Typography className={classes.text}>
                        {item.text}
                    </Typography>
                </div>
            ))}
        </div>
    )
}

export default LeftSide