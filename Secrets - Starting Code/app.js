//jshint esversion:6
require('dotenv').config();
const express =require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate=require("mongoose-findorcreate");

const app=express();

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


app.use(session({
    secret:"our little secret.",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());




mongoose.connect("mongodb://localhost:27017/userdb",{useNewUrlParser:true})

const userSchema= new mongoose.Schema({
    email:String,
    password:String,
    googleId:String,
    secret:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const userModel=new mongoose.model("User",userSchema);

passport.use(userModel.createStrategy());

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    userModel.findById(id,function(err,user){
        done(null,user.id);
    })
});

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    userModel.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/",function(req,res){
res.render("home");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get("/login",function(req,res){
    res.render("login");
    });

 app.get('/auth/google/secrets', 
 passport.authenticate('google', { failureRedirect: '/login' }),
 function(req, res) {
   // Successful authentication, redirect home.
   res.redirect('/secrets');
 });


app.get("/register",function(req,res){
        res.render("register");
        });

 app.get("/secrets",function(req,res){
     userModel.find({"secret":{$ne:null}},function(err,foundusers){
        if(err)
        console.log(err);
        else{
            if(foundusers){
                res.render("secrets",{userwithsecrets:foundusers})
            }
        }
     })
     });

app.get("/submit",function(req,res){
    if(req.isAuthenticated())
    res.render("submit") 
    else
    res.redirect('/login')
    });


  app.get("/logout",function(req,res){
             req.logout(function(err) {
                 if (err) 
                 return next(err); 
             });
             res.redirect("/");
             });


app.get("/logout",function(req,res){
    if(req.isAuthenticated())
    res.render("secrets") 
    else
    res.redirect('/login')


});
app.post("/submit",function(req,res){
const sec=req.body.secret;
userModel.findById(req.user,function(err,founduser){
    if(err)
     console.log(err);
     else{
        if(founduser){
            founduser.secret=sec;
            founduser.save(function(){
                res.redirect("/secrets");
            });
            
        }
     }
})

});


  app.post("/register",function(req,res){

   userModel.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
        console.log(err)
        res.redirect("/register");
    }
    else{
        passport.authenticate('local')(req,res,function(){
            res.redirect("/secrets");
        });
    }
   })


   

  });


  app.post("/login",function(req,res){
   const newuser=new userModel({
    username:req.body.username,
    password:req.body.password
   });

   req.login(newuser, function(err){
   if(err)
    console.log(err);
    else{
        passport.authenticate('local')(req,res,function(){
            res.redirect("/secrets");
        });
    }

   });


    
         
  });









app.listen(process.env.PORT || 3000,function(){
    console.log("server is running");
})