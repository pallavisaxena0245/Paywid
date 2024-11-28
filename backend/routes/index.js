// import {express} from "express";
const express = require('express');
const router = express.Router();
const z = require("zod");
const User = require('../db.js');


const signupBody = z.object({
    name: z.string().required(),
    username: z.string().required(),
    email: z.string().email().required(),
    password: z.string().required(),
})



router.post('/signup', function(req,res,next){

     const success = signupBody.safeParse(res.body);
     if(!success) return res.status(411).json({message: "Incorrect inputs"})

     //add data to mongodb
    const username= req.data.username;
    const email = req.data.email;
    const password = req.data.password;

    const userData = {username, email, password};

     const email_exists = user.findOne(email);

     if(!email_exists) return res.status(411).json({message: "User already exists, go to signup"});
      password = user.save();
      user.addData(userData);
     return res.status(200).json({message: "User successfully "});


})


const signup = z.object({
    email:z.string().email().required(),
    password:z.string().required()

})
router.post('/signin', function(req,res,next){

    const success = signup.safeParse(res.body)
    const {username, email, password} = req.data;


     const email_exists = user.findOne(email);

     if(!email_exists) return res.status(411).json({message: "User not found"});
      
     const newUser = new User({
        username, email,password
     })
  
     newUser.save();

})




module.exports = router;

