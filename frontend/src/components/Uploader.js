import {Button} from "@mui/material";
import React, {useState} from 'react';
const axios = require('axios');


export const upload = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);   
    reader.onload=()=>{
        console.log(reader.result)
        axios.post("/api/upload", {filename:file.name, content: reader.result, username:"syc"}).then(
            (res)=>{
                console.log(res)
            }
        ); 
    }
    // Details of the uploaded file 
}

const UploadButton = () => {
    const [file, setFile] = useState(null);
    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    }
    return (
        <div>
            <br/>
            <input type="file" onChange={onFileChange} />
            <Button onClick={()=>{
                console.log(file)
                upload(file)
            }
            }>upload</Button>
        </div>
    )
}
export default UploadButton;