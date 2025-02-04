const express= require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const _=require("lodash");
const mongoose= require("mongoose");

const app=express();

app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static(__dirname+'/public/'));

mongoose.connect("mongodb://127.0.0.1/postdb");

const postschema= new mongoose.Schema({
    title:String,
    content:String
});

const postmodel=mongoose.model("Posts",postschema);



const home  ="     lorem Ipsum is simply dummy text of the printing    and   typesetting industry.   Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets contain Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
const about="    lorem Ipsumhe printing   and   typesetting industry.    stry's standard dummy text ever sinceunknown printer to of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
const contact="  lorem Ipsum is simply dummy text of the printing and typesetting industry.      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";



app.get("/",function(req,res){
     postmodel.find({},function(err,result){
        res.render('journal',{content:home,title:"HOME",j:result});
     })

});


app.get("/about",function(req,res){
    res.render('about',{content:about,title:"ABOUT"});
    });

app.get("/contact",function(req,res){
     res.render('contact',{content:contact,title:"CONTACT"});
    });
    
app.get("/compose",function(req,res){
    res.render('compose',{title:"COMPOSE"});
    });


app.post("/compose",function(req,res){
       const po=new postmodel({
         title:req.body.ti,
        content:req.body.po
       });
        po.save();
       res.redirect("/");
});


app.get("/posts/:day",function(req,res){
    post.forEach(function(pos){
        if( _.lowerCase(req.params.day)===_.lowerCase(pos.ti)){
            res.render('post',{content:pos.po,title:pos.ti});
        }   
    });
    });








app.listen(8000,function(){
    console.log("server is ruuning");
});