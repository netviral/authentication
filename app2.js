// require('dotenv').config()
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const md5=require("md5");
// const encrypt=require("mongoose-encryption");
// const secret=process.env.SECRET;
mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser:true,useUnifiedTopology:true});
const schema=new mongoose.Schema({
  email:String,
  password:String
});
// schema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});
const User=mongoose.model("User",schema);

app.set("view engine","ejs");
app.listen(3000);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.route("/")
.get(function(req,res){
  res.render("home");
});

app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  User.findOne({email:req.body.username},function(err,foundUser){
    if(!err){
      if(foundUser){
        res.send("Username exists!");
      }else{
        const newUser=new User({
           email:req.body.username,
           password:md5(req.body.password)
        });
        newUser.save(function(err){
          if(!err){
             res.render("secrets");
          }else{
            res.send(err);
          }
        });
      }
    }else{
      res.send(err);
    }
  });
});
app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  User.findOne({email:req.body.username},function(err,foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password===md5(req.body.password)){
          res.render("secrets");
        }else{
          res.send("Username and password do not match! Please try again.");
        }
      }else{
        res.send("You haven't registered yet! Please register first.");
      }
    }else{
      res.send(err);
    }
  });
});
