const Joi = require("joi");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required:true,
        minlength:5,
        maxlength:50
    },
    password:{
        type: String,
        required: true,
        minlength :5 ,
        maxlength : 1000
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this.id,email:this.email},config.get("jwtPrivateKey"));
    return token ;
}
const User = mongoose.model("User",userSchema);

function userValidator(user){
    const schema = Joi.object({
        email:Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(1000).required()
    })
    return schema.validate(user);
}

exports.validate = userValidator;
exports.User = User;