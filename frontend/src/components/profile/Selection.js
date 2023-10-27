import {makeStyles} from "@mui/styles";
import {Button} from "@mui/material";
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center'
    },
    button: {
        width: "100%"
    }
}))

const menuItem = [
    {
        id: 1,
        title: "recipes",
        icon: <GridOnOutlinedIcon/>,
        type: "posts"
    },
    {
        id: 2,
        title: "moments",
        icon: <PhotoCameraOutlinedIcon/>,
        type: "moments"
    },
    {
        id: 3,
        title: "videos",
        icon: <VideoLibraryIcon/>,
        type: "videos"
    },
    {
        id: 4,
        title: "collected",
        icon: <BookmarkOutlinedIcon/>,
        type: "collections"
    }
]

const Selection = (props) => {
    const { onSelect } = props
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {menuItem.map(item => (
                <Button
                    key={item.id}
                    className={classes.button}
                    startIcon={item.icon}
                    onClick={() => onSelect(item.type)}
                >
                    {item.title}
                </Button>
            ))}
        </div>
    )
}

export default Selection