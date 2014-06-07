var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['Principal'];

io.sockets.on('connection', function (socket) {
	


	socket.on('create', function (roomname) {
    	rooms.push(roomname);
    	socket.broadcast.to('Principal').emit('updatechat', 'Servidor', 'Se ha creado la sala: '+ roomname);
    	socket.leave(socket.room);
		socket.join(roomname);
		socket.room = roomname;
		socket.emit('updaterooms', rooms, roomname);
		//socket.broadcast.to(roomname).emit('updatechat', 'Servidor', socket.username+' ha ingresado a la sala');
		socket.emit('updatechat', 'Servidor', 'Sala '+ roomname + ' creada correctamente');
    		//rooms[rooms] = rooms;
    		//socket.room = roomname;
            //socket.join(roomname);
    	//subscribe.subscribe(socket.room);
});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = 'Principal';
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join('Principal');
		// echo to client they've connected
		socket.emit('updatechat', 'Servidor', 'Bienvenido a la sala Principal');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('Principal').emit('updatechat', 'Servidor', username + ' se ha conectado');
		socket.emit('updaterooms', rooms, 'Principal');
	});
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'Servidor', 'Has ingresado a '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'Servidor', socket.username+' ha dejado la sala');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'Servidor', socket.username+' ha ingresado a la sala');
		socket.emit('updaterooms', rooms, newroom);
	});


	

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'Servidor', socket.username + ' se ha desconectado');
		socket.leave(socket.room);
	});
});
