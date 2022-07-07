const express = require('express');
const dotenv = require('dotenv');
const ejs = require('ejs');
const path = require('path');
const app = express();

app.use("/public",express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('view engine','ejs');


app.get("/",(req,res)=>{
    // res.render("index")
    res.sendFile(path.join(__dirname,"index.html"))
})
const PORT = process.env.PORT || 3000;
app.listen(PORT,(err)=>{
    if(err) console.log(err);
    else console.log(`Server running at port ${PORT}`);
})