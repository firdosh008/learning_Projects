const express= require("express");
const bodyparser=require("body-parser");

const https=require("https");
const { json } = require("body-parser");


const app=express();

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){

  const f =req.body.f;
  const l =req.body.l;
  const e =req.body.e;


var data={
  members:[
    {
     email_address:e,
     status:"subscribed",
     merge_fields:{
      FNAME: f,
      LNAME: l
     }
    }
  ]
};

var jsonData=JSON.stringify(data);

const url="https://us9.api.mailchimp.com/3.0/lists/744392dbf8";

const options={
  method:"POST",
  auth:"firdosh:d013b7f45b47cc1d813f48363e0e5afa-us9"

}

const request = https.request(url,options,function(response){

if(response.statusCode===200){
  res.sendFile(__dirname+"/success.html");
}
else
res.sendFile(__dirname+"/failure.html");

response.on("data",function(data){
  console.log(JSON.parse(data));
})
})

request.write(jsonData);
request.end();


});


app.listen(3000,function(){
    console.log("server is running");
})



//d013b7f45b47cc1d813f48363e0e5afa-us9

//744392dbf8