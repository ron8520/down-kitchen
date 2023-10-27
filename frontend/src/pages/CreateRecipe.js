/*!
 * This file is the add recipe page
 * User can upload their new recipe in this page
 * 
 */
import React, {useState, useRef} from 'react';
import {
    useParams
  } from 'react-router-dom';
import {Container, Stack, Grid, Typography,Paper} from "@mui/material";
import Material from "../components/mainpage/recipes/createMaterial";
import Step from "../components/mainpage/recipes/createStep";
import Description from "../components/mainpage/recipes/description";
import {useLocation} from "react-router-dom";
import ImageIcon from '@mui/icons-material/Image';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {makeStyles,styled} from "@mui/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import {useDispatch} from "react-redux";
import {setMessage} from "../redux/messageSlice";
import Slider from '@mui/material/Slider';
import {useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
const axios = require('axios');


const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(10)
    },
    slider : {
        paddingTop: theme.spacing(2)
    }
}))


function createMaterialData(MaterialCount, material, quantity, unit) {
    return {MaterialCount, material, quantity, unit};
}

function createStepData(StepCount, title, desc, file) {
    return {StepCount, title, desc, file};
}

const ProductImg = styled('img')({
    width: '100%',
    height: '80%',
    objectFit: 'cover',
    position: 'flex'
})



const CreateRecipe = () => {
    const navigate = useNavigate();
    const user = useSelector( (state) => state.user.userInfo)
    const dispatch = useDispatch();
    const classes = useStyles();
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeDesc, setRecipeDesc] = useState('');
    const [newMaterial, setNewMaterial] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newUnit, setNewUnit] = useState('');
    const [newStepTitle, setNewStepTitle] = useState('');
    const [newStepDesc, setNewStepDesc] = useState('');
    const [updateOnly, setUpdateOnly] = useState('');
    const [MaterialTable, setMaterialTable] = useState([]);
    const [StepTable, setStepTable] = useState([]);
    const [file, setFile] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [difficulty, setDifficulty] = useState(1);
    const [MaterialCount, setMaterialCount] = useState(1);
    const [StepCount, setStepCount] = useState(1);


    const [timeCost, setTimeCost] = useState(30);
    const fileInput = useRef(null)
    const handleRecipeTitleChange = (event) => {
        setRecipeTitle(event.target.value);
    }

    const handleRecipeDescChange = (event) => {
        setRecipeDesc(event.target.value);
    }

    const handleNewStepTitleChange = (event) => {
        setNewStepTitle(event.target.value);
    }

    const handleNewStepDescChange = (event) => {
        setNewStepDesc(event.target.value);
    }

    const handleUpdateChange = (event) => {
        setUpdateOnly("update");
    }    

    const addNewLine = () => {
        if (isNaN(newQuantity)) {
            dispatch(setMessage({"info": "quantity can not be non-number", "type": "error"}));
            return;
        }

        var r = /^\+?[1-9][0-9]*$/;　　//正整数
        if (r.test(newQuantity) === false) {
            dispatch(setMessage({"info": "quantity must be integer", "type": "error"}));
            return;
        }


        setMaterialTable([...MaterialTable, createMaterialData(MaterialCount, newMaterial, newQuantity, newUnit)]);
        setMaterialCount(MaterialCount+1);
        setUpdateOnly("temp")
        handleUpdateChange();
        return;
    }

    const deleteLastLine = () => {
        MaterialTable.splice(MaterialTable.length - 1);
        setMaterialTable([...MaterialTable]);
        if (MaterialCount !== 1) {
            setMaterialCount(MaterialCount - 1);
        }
        
        setUpdateOnly("temp")
        handleUpdateChange();
        return;
    }

    const showMaterialTable = () => {

        return (
            <Material {...MaterialTable}/>
        );
    }

    const chooseFile = (event)=>{
        setFile(event.target.files[0])
        setImgUrl(URL.createObjectURL(event.target.files[0]))
    }

    const addNewStepLine = () => {
        if (file === null) {
            dispatch(setMessage({"info": "Need to add a photo", "type": "error"}))
            return;

        }   
        setStepTable([...StepTable,createStepData(StepCount, newStepTitle, newStepDesc,file)])
        setStepCount(StepCount + 1);
        setUpdateOnly("temp")
    }

    const deleteLastStep = () => {
        StepTable.splice(StepTable.length - 1);
        setStepTable([...StepTable]);
        if (StepCount !== 1) {
            setStepCount(StepCount - 1);
        }
        
        setUpdateOnly("temp")
        handleUpdateChange();
        return;
    }

    const addNewStep = () => {
        let info = {"test":"testmsg"}
        // console.log(StepTable[0])
        return (
            <Stack>
            {
                StepTable.map((step,index)=>{
                    return <Step key={"Step-"+index} title={step} />
                })
            }
            </Stack>
        );        
    }
    const diffi = (difficulty) => {
        if(difficulty===1){
            return "EA"
        }else if(difficulty===2){
            return "NO"
        }else if(difficulty===3){
            return "IN"
        }else if(difficulty===4){
            return "CH"
        }
    }


    const cleanImagePart = ()=>{
        setFile(null)
        setImgUrl(null)
        fileInput.current.value = ''
    }

    /*!
    * Upload Function
    * After user click the submit bottom
    * this function work then.
    */
    const submitRecipe = () => {

        if (recipeTitle === "" || recipeDesc === "") {
            dispatch(setMessage({"info": "Recipe Title & Recipe Description can not be empty", "type": "error"}))
            return;
        }

        if (MaterialTable.length === 0 || StepTable.length === 0) {
            dispatch(setMessage({"info": "At least one material and one step are needed", "type": "error"}))
            return;
        }
 
            let StepList = []
            let test = 0;
            let MaterialList = [];
            for (let i = 0; i < MaterialTable.length; i++) {
                MaterialList.push({name: MaterialTable[i].material, amount: MaterialTable[i].quantity, unit: MaterialTable[i].unit});
            }

            

            for (let i = 0; i < StepTable.length; i ++) {
                
                let reader = new FileReader();
                reader.readAsDataURL(StepTable[i].file);   
                reader.onload=()=>{
                    console.log("111")
                    axios.post("/api/upload", {filename:StepTable[i].file.name, content: reader.result, username:"syc"}).then(
                        (res)=>{
                            console.log(i);
                            test += 1;
                            StepList.push({name: StepTable[i].title, order: i+1, desc: StepTable[i].desc, img_url: res.data.fileUrl});

                            if (test === StepTable.length) {
                                let info = {
                                    recipe: {
                                        name: recipeTitle,
                                        description: recipeDesc,
                                        cooking_time: timeCost,
                                        difficulty: diffi(difficulty),
                                        author: user.id,
                                        video_link: "123",
                                        img_url: StepList[0].img_url,
                                    },
                                    ingredients: MaterialList,
                                    steps: StepList,
                                }
                                console.log(info);
                                axios.post("/api/recipe/create/oneStep", info).then(
                                    (res)=>{
                                        console.log(res);
                                         
                                        dispatch(setMessage({"info": "Recipe Submit Successfully", "type": "success"}));
                                        navigate('/');
                                    }
                                ).catch((err)=>{
                                    console.log("upload fail")
                                     
                                });
                            }


                        }).catch((err)=>{console.log("upload fail")});
                }               
            }
            
            
            

    }


    return (
        
        <Container className={classes.root}>
            <Stack spacing={2}>
                <Typography variant="h2" component="div">New Recipe</Typography>
                <Container> 
                    
                    <TextField id="recipetitle" fullWidth onChange={(e)=>{handleRecipeTitleChange(e)}} inputProps={{ maxLength: 254 }} label="Recipe Title" variant="standard" />
                    <TextField id="recipedesc" fullWidth onChange={(e)=>{handleRecipeDescChange(e)}} inputProps={{ maxLength: 254 }} label="Recipe Description" variant="standard" multiline/> 
                    <div className={classes.slider}>
                        <Typography variant="button" component="div">Difficulty</Typography>
                        <Slider 
                            onChange={(event,newValue)=>{
                                setDifficulty(newValue)
                            }}
                            size="small"
                            defaultValue={1}
                            valueLabelDisplay="on"
                            step={1}
                            marks={[
                                {
                                  value: 1,
                                  label: 'Easy',
                                },
                                {
                                  value: 4,
                                  label: 'Hard',
                                },
                              ]}
                            min={1}
                            max={4}
                        />
                    </div>
                    <div >
                        <Typography variant="button" component="div">Time Cost(minutes)</Typography>
                        <Slider
                            onChange={(event,newValue)=>{
                                setTimeCost(newValue)
                            }}
                            size="small"
                            defaultValue={30}
                            min={1}
                            max={300}
                            valueLabelDisplay="on"
                            aria-label="Small"
                            valueLabelDisplay="auto"
                        />
                    </div>
                </Container> 
                <Typography variant="h4" component="div">Material Table</Typography>

                    <TextField id="newmaterial" onChange={(e)=>{setNewMaterial(e.target.value)}} inputProps={{ maxLength: 254 }} label="Material" variant="standard" />
                    <TextField id="newquantity" onChange={(e)=>{setNewQuantity(e.target.value);}} inputProps={{ maxLength: 254 }} label="Quantity" variant="standard" />
                    <TextField id="newunit" onChange={(e)=>{setNewUnit(e.target.value);}} inputProps={{ maxLength: 254 }} label="Unit" variant="standard" />
                    <Button onClick={() => {addNewLine()}} variant="text">Add New Material</Button>
                    <Button onClick={() => {deleteLastLine()}} variant="text">Delete last line</Button>
                    {showMaterialTable()}

                <Typography variant="h4" component="div">Steps</Typography>
                <input ref={fileInput} type="file" accept="image/gif,image/jpeg,image/jpg,image/png" onChange={chooseFile} hidden/>
                <Button onClick={()=>{fileInput.current.click()}} aria-label="reply" size="small">
                    <ImageIcon/>
                </Button>
                <Stack sx={{display:(imgUrl!==null?"inline":"none")}}>
                    <Stack>
                        <ProductImg src={imgUrl}/>
                        <Button onClick={cleanImagePart} aria-label="reply" size="small">
                            <DeleteIcon/>
                        </Button>
                    </Stack>
                </Stack>
                <TextField id="newsteptitle" onChange={(e)=>{handleNewStepTitleChange(e)}} inputProps={{ maxLength: 254 }} label="New Step Title" variant="standard" />
                <TextField id="newstepdesc" onChange={(e)=>{handleNewStepDescChange(e)}} inputProps={{ maxLength: 254 }} label="New Step Description" variant="standard" multiline/>
                <Button onClick={() => {addNewStepLine();handleUpdateChange()}} variant="text">Add New Step</Button>
                <Button onClick={() => {deleteLastStep()}} variant="text">Delete last step</Button>
                {addNewStep()}
                
            </Stack>

            <Button onClick={() => {submitRecipe()}} variant="text">Submit</Button>
            

        </Container>
    )
}

export default CreateRecipe;