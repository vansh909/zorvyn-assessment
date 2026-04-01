const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();


//db connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("database connected")
})
.catch((error)=>{
    console.log(error);
})

//server connection
const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
})