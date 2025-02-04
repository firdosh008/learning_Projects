const express = require("express");
const body_p =require("body-parser");
const https=require("https");

const app=express();

app.use(body_p.urlencoded({extended:true}));

app.get("/",function(req,res){
res.sendFile(__dirname+ "/index.html")
    
});

app.post("/",function(req,res){
  const query=req.body.cityname;  
    const api="650227eb1130957563cc23a2ae2ae152";
    const uni="metric";
    const URL="https://api.openweathermap.org/data/2.5/weather?q="+ query + "&units="+ uni +"&appid="+api;
    https.get(URL,function(response){
    response.on("data",function(data){
      const w=JSON.parse(data)
      const temp=w.main.temp;
      const dis=w.weather[0].description;
      const icon=w.weather[0].icon;
     
      res.write("<p>weather discription:"+ dis +"<p>");
      res.write("<h1>the temperature in "+ query+" is:"+ temp+"degrees celcius</h1>");
      res. write("<img src=http://openweathermap.org/img/wn/"+icon+"@2x.png>");
      res .send();

    })
})

});
app.listen(3000,function(){
    console.log("server is active");
})