//jshint eversion:6


const express =require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose")
const ejs=require("ejs");

const app=express();

app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser:true});

const articleSchema={
    title:String,
    content:String
};

const Article=mongoose.model("Article",articleSchema);



app.route("/articles")
    .get(function(req,res){
      Article.find(function(err,foundarticles){
        if(err)
         res.send(err);
         else
        res.send(foundarticles);
    
      });
      })
    .post(function(req,res){

        const newcontent=new Article({
            title:req.body.title,
            content:req.body.content
        });
    
        newcontent.save(function(err){
            if(err)
             res.send(err);
             else
             res.send("successfuly added");
        });
    
    })
    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(err)
            res.send(err);
            else
            res.send("sucesssfull delted");
        })
    });

app.route("/articles/:content")
   .get(function(req,res){
    Article.find({title:req.params.content},function(err,foundarticle){
        if(err)
        res.send(err);
        else if(foundarticle)
        res.send(foundarticle);
        else
        res.send("no article found");
    });

   })
   .put(function(req,res){
      Article.updateOne(
        {title:req.params.content},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
            if(err)
            res.send(err);
            else
            res.send("changed");
        }

        
        );

   })
   .patch(function(req,res){
    Article.updateOne(
      {title:req.params.content},
      {$set: req.body },
      function(err){
        if(!err)
        res.send("patched");
      }
    )
   })
   .delete(function(req,res){
     Article.findOneAndDelete({title:req.params.content},function(err){
        if(!err)
        res.send("deleted");
     })
   });














app.listen(process.env.PORT || 5000,function(){
    console.log("server is running");
})