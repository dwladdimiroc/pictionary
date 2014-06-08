var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8085);

app.use("/css", express.static(__dirname + '/css'));
app.use("/function", express.static(__dirname + '/function'));

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/view/index.html');
});

app.get('/sala-principal', function (req, res) {
  res.sendfile(__dirname + '/view/sala-principal.html');
});

app.get('/sala-pizarra', function (req, res) {
  res.sendfile(__dirname + '/view/sala-pizarra.html');
});

var usernames = {};
var usernameLista = {};

var rooms = ['Principal'];

var sala = {
    identificador: "",
    
    player1: "",
    player2: "",
    player3: "",
    player4: "",

    puntajeTeamA: 0,
    puntajeTeamB: 0,

    turnoA: 1,
    turnoB: 0,

    palabraTurno: ""
};

var listaSala = [];

function detectarSala(clients){
    
	return cont;
}

io.sockets.on('connection', function (socket) {
	
	//Crea una sala
	socket.on('create', function (roomname) {
		//Inicializar partida
		sala.identificador = roomname;
		sala.player1 = socket.user;
		sala.player2 = "";
	    sala.player3 = "";
	    sala.player4 = "";
	    sala.puntajeTeamA = 0;
	    sala.puntajeTeamB = 0;
	    sala.turnoA = 1;
	    sala.turnoB = 0;
	    sala.palabraTurno = "";
		listaSala.push(sala);

    	rooms.push(roomname);
    	socket.broadcast.to('Principal').emit('updatechat', 'Servidor', 'Se ha creado la sala: '+ roomname);
    	socket.leave(socket.room);
		socket.join(roomname);
		socket.room = roomname;
		socket.emit('updaterooms', rooms, roomname);
		socket.emit('updateusers', usernames);
		socket.emit('updatechat', 'Servidor', 'Sala '+ roomname + ' creada correctamente');
	});

	socket.on('adduser', function (user){
		socket.user = user;
		socket.room = 'Principal';
		usernames[user] = user;
		socket.join('Principal');
		socket.emit('updatechat', 'Servidor', 'Bienvenido a la sala Principal');
		socket.broadcast.to('Principal').emit('updatechat', 'Servidor', socket.user + ' se ha conectado');
		socket.emit('updaterooms', rooms, socket.room);
		socket.emit('updateusers', usernames);
	});
	
	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.user, data);
		socket.emit('updaterooms', rooms, socket.room);
		socket.emit('updateusers', usernames);

		//socket.emit('updatechat', 'VE', socket.valorEspacial);

		//Numero de clientes
		var clients = io.sockets.adapter.rooms[socket.room];
		for (var clientID in clients){
			//socket.emit('updatechat', 'User', clientID);
		}
	});

	socket.on('drawClick', function (data) {
		socket.broadcast.to('Principal').emit('updatechat', 'Prueba', 'hola');
		socket.broadcast.emit('draw', {
			x: data.x,
			y: data.y,
			type: data.type
	 	});
   	});
	
	socket.on('switchRoom', function (newroom){
		var salaLlena = 0;
		socket.broadcast.to('Principal').emit('updatechat', 'Servidor', newroom);
		for(var i=0 ; i < listaSala.length ; i++){
			socket.broadcast.to('Principal').emit('updatechat', 'Servidor', listaSala[i].identificador);
			if(listaSala[i].identificador == newroom){
				if(listaSala[i].player2 == ""){
					listaSala[i].player2 = socket.user;	
				}
				else if(listaSala[i].player3 == ""){
					listaSala[i].player3 = socket.user;	
				}
				else if(listaSala[i].player4 == ""){
					listaSala[i].player4 = socket.user;
				}
				else{
					salaLlena = 1;
				}
			}
			
		}	
		if(salaLlena == 0){
			if(socket.user)
				socket.leave(socket.room);
				socket.join(newroom);
				socket.emit('updatechat', 'Servidor', 'Has ingresado a '+ newroom);
				socket.broadcast.to(socket.room).emit('updatechat', 'Servidor', socket.user+' ha dejado la sala');
				socket.room = newroom;
				socket.broadcast.to(newroom).emit('updatechat', 'Servidor', socket.user+' ha ingresado a la sala');
				socket.emit('updaterooms', rooms, newroom);
				socket.emit('updateusers', usernames);
		}
		else{
			io.sockets.in(socket.room).emit('updatechat', 'Servidor', 'No puede ingresar a esa sala... Ingrese a otra');
		}
	});

	/*socket.on('userRoom', function (){
		socket.emit('cantuser', usernames);;
	});*/

	socket.on('disconnect', function(){
		delete usernames[socket.user];
		socket.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'Servidor', socket.user + ' se ha desconectado');
		socket.leave(socket.room);
	});
	
});
