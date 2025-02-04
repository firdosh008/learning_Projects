//jshint eversion:6

const express =require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose")
const _=require("lodash");

const app=express();

app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));





mongoose.connect("mongodb+srv://admin-firdosh:test123@cluster0.9kgudgi.mongodb.net/todolistDB");

const niteam=({
  name:String
});

const n=mongoose.model("iteam",niteam);

const iteam1=new n({
  name: "Welcome to your todolist"
});
const iteam2=new n({
  name: "hit + to add new iteam"
});
const iteam3=new n({
  name: "<---hit this to delete an iteam"
});

const defaultarray=[iteam1,iteam2,iteam3];


const ls={
  name:String,
  iteams:[niteam]
};

const li=mongoose.model("list",ls);




app.get("/",function(req,res){

  n.find({},function(err,result){
    
    if(result.length===0){
      n.insertMany(defaultarray);
      res.redirect("/");
    }
    else{
      res.render("list",{kindofday:"today" , newiteam:result});
    }  
  }) ;
});


app.post("/",function(req,res){
  const iteamname=req.body.newiteam;
  const listname=req.body.listTitle;
  const newi=new n({
    name:iteamname
  });
  if(listname==="today"){
    newi.save();
    res.redirect("/");
  }
  else{
    li.findOne({name:listname},function(err,foundList){
     
      foundList.iteams.push(newi);
      foundList.save();
      res.redirect("/"+listname);
     
    });
  }
});

app.get("/about",function(req,res){
  res.render("about");
});


app.post("/delete",function(req,res){

const cIi=(req.body.checkbox);
const ln=req.body.listname;
if(ln[0]==="today"){
  n.findByIdAndRemove(cIi,function(err){
    if(!err)
      res.redirect("/");
  });
  
}
else{
  li.findOneAndUpdate({name:ln[0]},{$pull: {iteams :{_id:cIi}}},function(err,foundlist){
    if(!err)
    res.redirect("/"+ln[0]);
  })
   
}


 
});

app.get("/:ca",function(req,res){

  li.findOne({name:_.capitalize(req.params.ca)},function(err,foundList){
    if(!err){
      if(!foundList){
        const list=new li({
          name:_.capitalize(req.params.ca),
          iteams:defaultarray
        });
        list.save();
        res.redirect("/"+_.capitalize(req.params.ca));
      }
      else{
        res.render("list",{kindofday:foundList.name , newiteam:foundList.iteams});
      }
   }
  });
   
});


  

   




app.listen(process.env.PORT || 3000,function(){
    console.log("server is running");
})