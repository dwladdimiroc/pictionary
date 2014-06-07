var puerto = 8008;
var io = require('socket.io').listen(puerto);


io.sockets.on('connection', function (socket) { // conexion
	
	socket.on('ejemplo3', function (data) {
		console.log("Entro al "+ data.room);
		socket.join(data.room);
	});
	
	socket.on('salirRoom', function (data) {
		  socket.leave(data.room);
	});

	socket.on('disconnect', function () {
		console.log("Usuario desconectado");
	});
	
	socket.on('broadcastDeCliente', function (data) {
		console.log("Un usuario envió el mensaje: " + data.mensaje);
		socket.broadcast.emit('alguienBroadcasteo', { texto:data.mensaje});
		//socket.broadcast manda a todos
	});
});

