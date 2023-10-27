import { Container, Divider} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Info from "../components/profile/Info";
import Selection from "../components/profile/Selection";
import UserPost from "../components/profile/UserPost";
import {useEffect, useState} from "react";
import UserMoment from "../components/profile/UserMoment";
import UserCollection from "../components/profile/UserCollection";
import {useParams} from "react-router-dom";
import axios from "axios";
import UserVideo from "../components/profile/UserVideo";

/**
 * A page for display user information,
 * includes their upload recipes, moments, videos and collections
 */
const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(5)
    },
    divider: {
        height: 10
    }
}))

const Profile = () => {
    const { userId } = useParams();
    const [recipes, setRecipes] = useState([])
    const [moments, setMoments] = useState([])
    const [collections, setCollections] = useState([])
    const classes = useStyles();
    const [display, setDisplay] = useState('posts')

    const handleDisplay = (type) => {
        setDisplay(type);
    }

    useEffect(() => {
        getRecipes()
        getMoment()
        getCollections()
    }, [userId])

    const getRecipes = () => {
        axios
            .get("/api/recipe/getByUser/?id=" + userId)
            .then((res) => {
                setRecipes(res.data.recipes);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getMoment = () => {
        axios
            .get("/api/moment/get/?user_id=" + userId)
            .then((res) => {
                setMoments(res.data.moments)
            })
            .catch((error) => {
                console.log(error)
                setMoments([])
            })
    }

    const getCollections = () => {
        axios
            .get('/api/user/collection/get/?user_id=' + userId)
            .then((res) => {
                setCollections(res.data.collections)
            })
            .catch((error) =>{
                console.log(error)
            })
    }


    return (
        <Container className={classes.root}>
            <Info
                onSelect={handleDisplay}
                userId={userId}
                recipeNum={recipes.length}
                momentNum={moments.length}
            />
            <Divider className={classes.divider}/>
            <Selection select={display} onSelect={handleDisplay}/>
            { display === 'posts' && (
                <UserPost
                    rows={recipes}
                    getData={getRecipes}
                    getCollection={getCollections}
                    userId={userId}
                />
            )}
            { display === 'moments' && (
                <UserMoment
                    rows={moments}
                    getData={getMoment}
                    userId={userId}
                />
            )}
            { display === 'videos' && (
                <UserVideo
                    rows={moments}
                    getData={getMoment}
                    userId={userId}
                />
            )}
            { display === 'collections' && (
                <UserCollection
                    rows={collections}
                    getData={getCollections}
                    userId={userId}
                />
            )}
        </Container>
    )
}

export default Profile;