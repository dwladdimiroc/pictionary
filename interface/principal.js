var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

app.use("/css", express.static(__dirname + '/css'));
app.use("/function", express.static(__dirname + '/function'));

// routing
app.get('/sala-principal.html', function (req, res) {
  res.sendfile(__dirname + '/sala-principal.html');
});

var usernames = {};

var rooms = ['Principal'];

io.sockets.on('connection', function (socket) {
	
	socket.on('create', function (roomname) {
    	rooms.push(roomname);
    	socket.broadcast.to('Principal').emit('updatechat', 'Servidor', 'Se ha creado la sala: '+ roomname);
    	socket.leave(socket.room);
		socket.join(roomname);
		socket.room = roomname;
		socket.emit('updaterooms', rooms, roomname);
		socket.emit('updateusers', usernames);
		socket.emit('updatechat', 'Servidor', 'Sala '+ roomname + ' creada correctamente');

});

	socket.on('adduser', function(username){
		socket.username = username;
		socket.room = 'Principal';
		usernames[username] = username;
		socket.join('Principal');
		socket.emit('updatechat', 'Servidor', 'Bienvenido a la sala Principal');
		socket.broadcast.to('Principal').emit('updatechat', 'Servidor', username + ' se ha conectado');
		socket.emit('updaterooms', rooms, 'Principal');
		socket.emit('updateusers', usernames);

	});
	
	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
		socket.emit('updaterooms', rooms, 'Principal');
		socket.emit('updateusers', usernames);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'Servidor', 'Has ingresado a '+ newroom);
		socket.broadcast.to(socket.room).emit('updatechat', 'Servidor', socket.username+' ha dejado la sala');
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'Servidor', socket.username+' ha ingresado a la sala');
		socket.emit('updaterooms', rooms, newroom);
		socket.emit('updateusers', usernames);

	});

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'Servidor', socket.username + ' se ha desconectado');
		socket.leave(socket.room);
	});
});
