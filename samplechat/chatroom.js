
//PORT to connect to
const PORT = 3000;
 
//Declarations
var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
app.set('port', process.env.PORT || PORT);
var server   = require('http').Server(app).listen(PORT);
var io       = require('socket.io')(server);
//End of Declarations

//Instantiate socket server
//var app = require('http').createServer().listen(PORT);

//Mongoose Connection initiation
mongoose.connect("mongodb://127.0.0.1:27017/chatapplication");


// create a schema for chat
var ChatSchema = mongoose.Schema({
  chatroomid: String,
  date: Date,
  from: String,
  to: String,
  message: String
},{timestamps:true});

//Creating Model for the Chat schema
var Chat = mongoose.model('Chat', ChatSchema);


//Defining CORS Parameters
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

//var io = require('socket.io').listen(app);

io.set("log level", 1);
var people = {};

//Global Variable
var usernames = [];
var rooms = ['Chatroom1','Chatroom2','Chatroom3','Chatroom4','Chatroom5'];

//Socket Connection Definition

io.sockets.on('connection', function(socket) {
    socket.on('adduser', function(username) {
        socket.username = username;
        socket.room = 'Chatroom1';
		var room;
        room = socket.room;
        usernames.push(username);
        socket.join(room);
        socket.emit('updatechat', 'Chat Admin', 'you have joined '+room);
		socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has joined this room');
        socket.emit('updaterooms', rooms, room,usernames,username);
		socket.broadcast.to(room).emit('updaterooms', rooms, room,usernames,username);
    });

  /*  socket.on('create', function(room) {
        rooms.push(room);
        socket.emit('updaterooms', rooms, socket.room);
    });*/

    socket.on('sendchat', function(data) {
        io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
		
		var chatData = {
       chatroomid: "Chatroom1",
       date: new Date(),
	   from: socket.username,
	   to: "other person",
	   message: data
		  };
  
  var newChat = new Chat(chatData);
    //Call save to insert the chat
    newChat.save(function(err, savedChat) {
      console.log(savedChat);
    });
  
    });

    socket.on('switchRoom', function(newroom) {
        
		var oldroom;
        oldroom = socket.room;
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat', 'Chat Admin', 'you have connected to ' + newroom);
        socket.broadcast.to(oldroom).emit('updatechat', 'Chat Admin', socket.username + ' has left this room');
		var index = usernames.indexOf(socket.username);
        usernames.splice(index, 1);
		socket.broadcast.to(oldroom).emit('updaterooms', rooms, oldroom,usernames,socket.username);
		socket.emit('updaterooms', rooms, oldroom,usernames,socket.username);
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'Chat Admin', socket.username + ' has joined this room');
        usernames.push(socket.username);	
        socket.broadcast.to(newroom).emit('updaterooms', rooms, newroom,usernames,socket.username);		
        socket.emit('updaterooms', rooms, newroom,usernames,socket.username);		
		
      
    });

    socket.on('disconnect', function() {
		
		var index = usernames.indexOf(socket.username);
        usernames.splice(index, 1);
        //delete usernames[socket.username];
        socket.broadcast.emit('updatechat', 'Chat Admin', socket.username + ' has disconnected');
		socket.broadcast.to(socket.room).emit('updaterooms', rooms, socket.room,usernames,socket.username);
        socket.leave(socket.room);
    });
 });