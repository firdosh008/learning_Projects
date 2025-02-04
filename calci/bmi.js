const expr= require("express");
const app=expr();

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/bmi.html");
})

app.post("/",function(req,res){
    var w=req.body.w;
    var h=req.body.h;

    res.send("bmi:" +( w/(h*h)))
})

app.listen(3000,function(){
    console.log("server is running on 3000");
    
})