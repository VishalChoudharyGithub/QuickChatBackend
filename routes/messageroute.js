const express = require('express');
const Message = require("../models/message");
const authMiddleware = require('../middlewares/authmiddleware');

const router = express.Router();

router.post("/",authMiddleware,(req,res)=>{

    const pageNo = req.body.pageNo;
    if(pageNo==null){
        return res.status(400).send("Page number required");
    }

    
    Message.find({},(err,messages)=>{
        if(err) res.send(err.Message);
        res.status(200).send(messages);
    }).select("sender message -_id").sort({"createdAt":-1}).skip((pageNo-1)*10).limit(10);
})




module.exports = router;