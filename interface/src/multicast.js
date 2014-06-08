
var puerto = 8008;
var io = require('socket.io').listen(puerto);

io.sockets.on('connection', function (socket) { 
	
	socket.on('ejemplo2', function (data) {
		if(data.room != "")
		io.sockets.in(data.room).emit('Multicast', {room: data.room, texto: data.text});
	});
	
	socket.on('ejemplo3', function (data) {
		console.log("Entro al "+ data.room);
		socket.join(data.room);
	});

	socket.on('salirRoom', function (data) {
		  socket.leave(data.room);
	});

	//Registro una acción cuando ocurre el evento de que un cliente se desconecta
	socket.on('disconnect', function () {
		console.log("Usuario desconectado");
	});

});

