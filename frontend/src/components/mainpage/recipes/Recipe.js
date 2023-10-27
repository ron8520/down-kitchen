import {Box, Card, Link, Stack, Typography} from "@mui/material";
import {styled} from "@mui/styles";
import {Link as RouterLink} from 'react-router-dom';

/*

This is the recipe recomendations, which will display in the mainpage,

This is the components of each recomendations.

*/

const RecipeImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
})

 
export default function Recipe(props) {
    const {name,img_url,id} = props;
    return (
        <Card>
            <Box sx={{pt: '100%', position: 'relative'}}>
                <RecipeImg src={img_url}/>
            </Box>

            <Stack sx={{ p: 3 }} justifyContent={"center"}>
                <Link to={`/recipe/${id}`} color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {name}
                    </Typography>
                </Link>
            </Stack>
        </Card>
    )
}

 