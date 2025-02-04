const express=require("express");
const app=express();


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
    const n1=(req.body.num1);
    const n2=(req.body.num2);

    

    res.send("thanx for posting'your answer is:" + (n1+n2));
});

app.listen(3000,function(){
    console.log("server is running on 3000");
});