const express = require('express');
const {User,validate} = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/",async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    

    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send('User already registered...');

    user = new User({email: req.body.email,password:req.body.password});
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password,salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token",token).send({email:user.email});
})

module.exports = router;