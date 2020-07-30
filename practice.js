const express=require("express");
const app=express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const bcrypt=require("bcrypt");
const saltRounds=10;
const errorMessage="";

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true });
const schema=new mongoose.Schema({
  email:String,
  password:String
});
const User=mongoose.model("User",schema);


app.listen(3000);
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.route("/")
.get(function(req,res){
    res.render("home");
});
app.route("/register")
.get(function(req,res){
   res.render("register",{errorMessage:errorMessage});
})
.post(function(req,res){
    User.findOne({email:req.body.username},function(err,foundUser){
      if(!err){
         if(foundUser){
           res.render("login",{errorMessage:"Already registered! Please login."});
         }else{
           bcrypt.hash(req.body.password,saltRounds,function(err,hash){
             if(!err){
               const newUser=new User({
                 email:req.body.username,
                 password:hash
               });
               newUser.save(function(err){
                 if(!err){
                   res.render("login",{errorMessage:errorMessage});
                 }else{
                   res.send(err);
                 }
               });
             }else{
               res.send("An error occured. Please try again!");
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
   res.render("login",{errorMessage:errorMessage});
})
.post(function(req,res){
    User.findOne({email:req.body.username},function(err,foundUser){
      if(!err){
         if(foundUser){
           bcrypt.compare(req.body.password,foundUser.password,function(err,result){
             if(err){
               res.send(err);
             }else{
               if(result===true){
                 res.render("secrets");
               }else{
                 res.render("login",{errorMessage:"Username and password do not match. Please try again!"});
               }
             }
           });
         }else{
           res.render("register",{errorMessage:"You haven't registered yet. Please register first!"});
         }
      }else{
        res.send(err);
      }
    });
});
