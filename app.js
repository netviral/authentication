const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const saltRounds=10;
app.listen(3000);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
const schema=new mongoose.Schema({
  email:String,
  password:String
});
mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser:true,useUnifiedTopology:true});
const User=mongoose.model("User",schema);
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
        res.send("Already registered! Please login or choose a different username.");
      }else{

        bcrypt.hash(req.body.password,saltRounds,function(err,hash){
          const newUser=new User({
            email:req.body.username,
            password:hash
          });
          newUser.save(function(err){
            if(err){
              res.send(err);
            }else{
              res.render("login");
            }
          });
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
        bcrypt.compare(req.body.password,foundUser.password,function(err,result){
          if(!err){
            if(result===true){
              res.render("secrets");
            }else{
              res.send("Username and password do not match!");
            }
          }else{
            res.send(err);
          }
        });
      }else{
        res.send("You haven't registered yet. Please register first!");
      }
    }else{
      res.send(err);
    }
  });
});
