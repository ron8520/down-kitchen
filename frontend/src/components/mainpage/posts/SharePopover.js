// import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {IconButton, Popover, Stack} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WeiboShareButton,
    WeiboIcon
} from "react-share";
import {makeStyles} from "@mui/styles";
//this is the share propover, use to share the post to facebook, weibo..
const useStyle = makeStyles( {
    window: {
        minHeight:50,
        height:'15%',
    },
    button: {
        margin: '10px'
    }
})

const SharePopover = (props) => {
    const { recipeId } = props
    const classes = useStyle()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'account-popover' : undefined;

    return (
        <div style={{display: 'inline'}}>
            <IconButton
                onClick={handleOpen}
                aria-describedby={id}
                color="inherit"
            >
                <ShareIcon />
            </IconButton>

            <Popover
                className={classes.window}
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
                        width: 190
                    }
                }}
            >
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                >
                    <div className={classes.button}>
                        <FacebookShareButton url={"http://127.0.0.1:3000/recipe/" + recipeId}>
                            <FacebookIcon size={32} round={true}/>
                        </FacebookShareButton>
                    </div>

                     <div className={classes.button}>
                        <TwitterShareButton url={"http://127.0.0.1:3000/recipe/" + recipeId}>
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </div>

                     <div className={classes.button}>
                        <WeiboShareButton url={"http://localhost:3000/recipe/" + recipeId}>
                            <WeiboIcon size={32} round />
                        </WeiboShareButton>
                    </div>

                </Stack>
            </Popover>
        </div>
    )
}

export default SharePopover;