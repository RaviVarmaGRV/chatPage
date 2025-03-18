const express=require('express');
const app=express();
const path=require('path');
const pubDir=path.join(__dirname,"/public");

const socketio=require('socket.io');
const http=require('http');

var server=http.createServer(app);
var io=socketio(server);

app.use(express.static(pubDir));
app.set("view engine", "ejs");


app.get('/',(req,res)=>{
    res.render('home');
});

var allUsers=new Map();

io.on("connection",(socket)=>{
    socket.on('addMe',(usrName)=>{
        allUsers.set(socket.id,usrName);
        console.log(allUsers);   
    });


    //join a room first
    

    socket.on('joinRoom',(roomName)=>{
        socket.join(roomName); 
        socket.broadcast.emit('otherConnection',"New one entered");
    });

    socket.on('check',(usrName,callback)=>{
        var allNames=[...(allUsers.values())]
        console.log(allNames);
        console.log(usrName);
        

        console.log(allNames.includes(usrName));
        
        
        callback(allNames.includes(usrName));
    });

    socket.on('addMessage',(msg,usrName,toPerson,type)=>{     
        console.log('received');
           if (type!='group') {
                socket.broadcast.emit('msgAdd',msg,usrName,toPerson);
           }
           else{
            var roomNmae=toPerson;
                io.to(roomNmae).emit('msgAdd',msg,usrName,toPerson);
           }
    });

    socket.on('disconnect',()=>{                
        allUsers.delete(socket.id);
    });

    

})

server.listen('3008',()=>{
    console.log('Port 3008 connected');  
})