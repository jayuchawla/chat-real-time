import React, { useState,useEffect } from 'react';
import queryString from 'query-string'; //for importing data from url
import './Chat.css';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar.js';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;

const Chat = ({ location }) => {

    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [message,setMessage] = useState(''); //to process each message in messages variable
    const [messages,setMessages] = useState([]); //to store all messages

    const ENDPOINT = 'https://server-jay.herokuapp.com/';

    ///useEffect hook to handle user join
    useEffect(() => {
        const data = queryString.parse(location.search);
        const name = data.name;
        const room = data.room;

        ///when we get first connection, we set socket = IO and pass an endpoint to server ///from GOOGLE: An endpoint is a URL which allows you to access a (web) service running on a server
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);
        //console.log(socket);
        //console.log(name+" "+room);    
        ////emit is used to handle changes to be done accordingly by server when an appropriate request is made at front end
        socket.emit('join', { name,room },( error ) => {
            //the above arrow function is triggered once calback function responds from server side
            //alert(error)
        });

        ///return is ran once this particular instance is off or say particular component is unmounted
        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    },[ENDPOINT,location.search]) //[] mention as a list those values on whose change useEffect is refreshed


    ///useEffect hook to handle messages visible to user
    useEffect(() => {
        socket.on('message', (message) => {
            ///since state is immutable hence we spread all other messages and one more message the latest one
            setMessages([...messages, message]);
        })
    }, [messages]) ///we run this useEffect only when messages array change!!!


    ///function to sendMessage
    const sendMessage = (event) => {
        ///to handle non refreshing of page once enter is pressed
        event.preventDefault();

        if(message){
            ////if message typed is not null emit to sendMessage defined in server which will respond using callback and once it reponds back just clear the message variable so that new message can be stored  
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message,messages);

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                {/*<input 
                value={message} 
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event):null}
                />*/}
                <Messages messages= {messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
        
    );
}

export default Chat;