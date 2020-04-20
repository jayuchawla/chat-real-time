const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');

//import { addUser, removeUser, getUser, getUsersInRoom } from './users';
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
io.origins('*:*');


io.on('connection', (socket) => {
    //console.log("We have new connection")

    ///the things emitted by client are handled here
    ///what is the callbcak thing??? whenever a joining request is seen by a user this callback is responsible to respond with confirmation or error
    socket.on('join',({name,room}, callback)  => {
        console.log(`Entity with name ${name} and room ${room} has joined!`);

        
        ///the below callback function will immediately trigger a response once socket.io event is emitted by client ,,this can be used for error handling
        ///const error = true;
        ///if(error){
        ///callback({error:'error'});}

        ///why 2 args look at the function you can be either rerturned with an error or a user object
        const { error,user } = addUser({id:socket.id, name:name, room:room});
        // if error is returned simply respond the user back with a failure
        if(error){
            return callback(error);
        }

        ///admin/system generated message to client
        socket.emit('message', {user:'admin',text: `Welcome ${user.name} to room ${user.room}. This is a machine generated message!`});
        ///broadcast to whole room after that let the unew user join
        socket.broadcast.to(user.room).emit('message', {user:'admin',text:`${user.name} has joined the chat!`});
        ////if no errro simply use built in methid join
        socket.join(user.room);
            
        io.to(user.room).emit('roomData', {room: user.room,users: getUsersInRoom(user.room)});
        callback();
    })

    ///generate events for user sent and received message
    ///N-O-T-E---: the difference between on and emit : on expects an action from frontend whereas emit just sends something from backend to frontend
    socket.on('sendMessage', (message, callback) => {
        ///get sender's id
        const user = getUser(socket.id);
        //we need to send his message to the current user's room
        io.to(user.room).emit('message', {user:user.name,text:message});
        io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)});
        ///to do something after message is sent on frontend
        callback();
    });

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', {user:'admin', text:`${user.name} has left the chat`});
        }
        console.log("User left")
    })
});


app.use(router);

server.listen(PORT, () => console.log(`server has started on Port ${PORT}`));