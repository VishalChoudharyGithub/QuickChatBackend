const express = require("express");
const config = require('config');
const mongoose = require('mongoose');
const  users = require("./routes/users");
const auth = require("./routes/auth");
const messageRoute = require("./routes/messageroute");
const Message = require("./models/message");
const auth_middleware = require("./middlewares/authmiddleware");
const jwt = require("jsonwebtoken");


const app = express();
const http = require('http').Server(app);
const io = require("socket.io");
const socket = io(http);

if(!config.get("jwtPrivateKey")){
    console.error("FATAL ERROR : jwtprivatekey is not defined");  //set chatapp_jwtPrivateKey=value
    process.exit(1);
}

mongoose.connect('mongodb://localhost/chatapp',{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>console.log('connected to MongoDB...'))
    .catch(err=>console.log('could not connected to mongodb'));

app.use(express.json());
app.get("/",(req,res)=>{
    res.send("hello");
})
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use('/api/messages',messageRoute);

socket.on("connection",function(socket){

    console.log("user connected");
    socket.on("disconnect",function(){
        console.log("User disconnect");
    })
    socket.on("message_sent",(jsonData)=>{
        const data = JSON.parse(jsonData);
        try{
        const decodedToken = jwt.verify(data.token,config.get('jwtPrivateKey'));
        const sender = decodedToken.email;
        const message = data.message;
        const messageDocument = new Message({sender:sender,message:message});
        messageDocument.save().then(()=>{
            console.log("saved");
            socket.emit("message_received",{message:message,sender:sender});
        });
        
        
        }catch(ex){
            console.log(ex.message);
        }
       
        
    })
});

const port = process.env.PORT || 3000;
var server = http.listen(port, () => {
    console.log('server is running on port', server.address().port);
  });
