var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var animales = ['perro', 'gato','conejo','camello','cerdo','culebra','hombre','cocodrilo','gaviota','paloma'];
var objeto = ['mesa', 'silla', 'auto', 'rueda', 'computador','bicicleta', 'moto','celular','lapiz','estufa'];
var accion = ['bañarse', 'saltar','cantar','caminar','gritar','estornudar','nadar','escuchar','correr','comer'];
var profesion = ['ingeniero','mecanico','doctor','profesor','dentista', 'dibujante','escritor','comediante','vagabundo','ladron'];
var random = ['ramon', 'pedro','juan', 'dios', 'jesus','maria','iphone','android','bebida', 'dormir','despertar', 'todo','superman'];
var consultas = [1,2,3,4,5];

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

var userConect = []; 	//User in Principal
var userRoom = [];		//User in room

var rooms = ['Principal'];	//List of ID Room
var listaSala = [];			//List of Rooms

var sala = {
    identificador: "",
    cantidadPlayer: 0,
    
    player1: "",
    player2: "",
    player3: "",
    player4: "",

    puntajeTeamA: 0,
    puntajeTeamB: 0,

    turnoA: 0,
    turnoB: 0,

    palabraTurno: "",
    puntajePalabra: 0,

    listaJugar: 0
};

var word = {
  texto: "",
  puntaje: ""
};

function searchName (name) {

	var coincidencia = "No";

	//console.log("Lenght %d", userConect.length);
	//console.log("Name: %s", name);
	for(var i=0 ; i < userConect.length ; i++){
		//console.log("User %s", userConect[i]);
		if(userConect[i] == name){
			coincidencia = "Yes";
			break;	
		}
	}

	return coincidencia;
}

function searchRoom(name) {
	var coincidencia = "No";

	//console.log("Lenght %d", userConect.length);
	//console.log("Name: %s", name);
	for(var i=0 ; i < rooms.length ; i++){
		//console.log("User %s", userConect[i]);
		if(rooms[i] == name){
			coincidencia = "Yes";
			break;	
		}
	}

	return coincidencia;
}

function identificarRoom(user){
	//console.log("Identificacion");
	for(var i=0 ; i < listaSala.length ; i++){
		if( listaSala[i].player1 == user || listaSala[i].player2 == user || listaSala[i].player3 == user || listaSala[i].player4 == user ) 
		{
			//console.log("ID Room %s", listaSala[i].identificador);
			return listaSala[i].identificador;;
		}
	}	
}

function deleteUserRoomPrincipal(user){
	//console.log(user);
	var index = userConect.indexOf(user);
	if (index > -1) {
		//console.log(index);
    	userConect.splice(index, 1);
	}
}

function deleteUserRoom(user, room){
	for(var i=0 ; i<listaSala.length ; i++){
		if(room == listaSala[i].identificador){
			if(user == listaSala[i].player1){
				listaSala[i].player1="";
			}
			else if(user == listaSala[i].player2){
				listaSala[i].player2="";	
			}
			else if(user == listaSala[i].player3){
				listaSala[i].player3="";
			}
			else if(user == listaSala[i].player4){
				listaSala[i].player4="";
			}
			listaSala[i].cantidadPlayer--;
			listaSala[i].listaJugar = 0;
		}
	}
}


function updateListUserRoom(room){
	for(var i=0 ; i<listaSala.length ; i++){
		if(room == listaSala[i].identificador){
			userRoom.push(listaSala[i].player1);
			userRoom.push(listaSala[i].player2);
			userRoom.push(listaSala[i].player3);
			userRoom.push(listaSala[i].player4);
		}
	}
}

function idRoom(room){
	//console.log("Room %s", room);
	for(var i=0 ; i<listaSala.length ; i++){
		//console.log("cantidadPlayer %d", listaSala[i].cantidadPlayer);
		if(room == listaSala[i].identificador){
			return i;
		}
	}
	return -1;
}

function generarRandom(){
    var palabra = {
    	texto: "",
    	puntaje: ""
	};
	var numero = consultas[Math.floor(Math.random() * consultas.length)];
	if (consultas==1) {
		palabra.texto = animales[Math.floor(Math.random() * animales.length)];
		palabra.puntaje = 1;
	}
	else if (consultas==2)
	{
		palabra.texto = objeto[Math.floor(Math.random() * objeto.length)];
		palabra.puntaje = 2;
	}
	else if (consultas==3)
	{
		palabra.texto = accion[Math.floor(Math.random() * accion.length)];
		palabra.puntaje = 3;
	}
	else if (consultas==4)
	{
		palabra.texto = profesion[Math.floor(Math.random() * profesion.length)];
		palabra.puntaje = 4;
	}
	else 
	{
		palabra.texto = random[Math.floor(Math.random() * random.length)];
		palabra.puntaje = 5;
	}
	
	//console.log("RandomReturn");
	return palabra;
}

io.sockets.on('connection', function (socket) {
	
	//Crea una sala
	socket.on('create', function (roomname) {
		//Inicializar partida
		sala.identificador = roomname;
		sala.cantidadPlayer = 0;
		sala.player1 = "";
		sala.player2 = "";
	    sala.player3 = "";
	    sala.player4 = "";
	    sala.puntajeTeamA = 0;
	    sala.puntajeTeamB = 0;
	    sala.turnoA = 0;
	    sala.turnoB = 0;
	    sala.palabraTurno = "";
	    sala.puntajePalabra = 0;
	    sala.listaJugar = 0;
		listaSala.push(sala);

    	rooms.push(roomname);
    	socket.broadcast.to('Principal').emit('updatechat', 'Servidor', 'Se ha creado la sala: '+ roomname);

		//userRoom = searchUserRoom(socket.room);
		socket.emit('updaterooms', socket.user, rooms, socket.room);
	});

	//A~nadir usuario
	socket.on('adduser', function (user){
		socket.user = user;
		socket.room = 'Principal';
		socket.play = 0;
		userConect.push(user);
		socket.join('Principal');
		socket.emit('updatechat', 'Servidor', 'Bienvenido a la sala Principal');
		socket.broadcast.to('Principal').emit('updatechat', 'Servidor', socket.user + ' se ha conectado');
		socket.emit('updaterooms', socket.user, rooms, socket.room);
		socket.emit('updateusers', userConect);
		socket.broadcast.to('Principal').emit('updateusers', userConect);
	});

	//Reconectar usuario
	socket.on('reconnectuser', function (user){
		socket.user = user;
		socket.play = 1;
		socket.room = identificarRoom(user);
		socket.join(identificarRoom(user));
		socket.emit('updatechat', 'Servidor', 'Bienvenido a la sala '+socket.room);
		socket.broadcast.to(socket.room).emit('updatechat', 'Servidor', socket.user + ' se ha conectado');
		
		updateListUserRoom(socket.room);		
		socket.emit('updateusers', userRoom);
		socket.broadcast.to(socket.room).emit('updateusers', userRoom);
		userRoom = [];

		//console.log("CtdUser: %d",listaSala[idRoom(socket.room)].cantidadPlayer);
		socket.emit('statisticsPlay', listaSala[idRoom(socket.room)]);
		socket.broadcast.to(socket.room).emit('statisticsPlay', listaSala[idRoom(socket.room)]);

		//console.log("ID Room %d", idRoom(socket.room));
		//console.log("Cant. Player %d", listaSala[idRoom(socket.room)].cantidadPlayer);
		if( listaSala[idRoom(socket.room)].cantidadPlayer == 4 ){
			socket.emit('updatechat', 'Servidor', 'Listos para jugar');
			socket.broadcast.to(socket.room).emit('updatechat', 'Servidor', 'Listos para jugar');

			//Inicializar sala
			listaSala[idRoom(socket.room)].listaJugar = 1;
			//Random palabra
			word = generarRandom();
			listaSala[idRoom(socket.room)].palabraTurno = word.texto;
			listaSala[idRoom(socket.room)].puntajePalabra = word.puntaje;

			socket.emit('startPlay', listaSala[idRoom(socket.room)]);
			socket.broadcast.to(socket.room).emit('startPlay', listaSala[idRoom(socket.room)]);
		}
	});

	socket.on('sendchat', function (data) {
		//console.log("Socket Room %s", socket.room);
		socket.emit('updaterooms', socket.user, rooms, socket.room);
		io.sockets.in(socket.room).emit('updatechat', socket.user, data);	
	});

	socket.on('drawClick', function (data) {
		socket.broadcast.emit('draw', {
			x: data.x,
			y: data.y,
			type: data.type
	 	});
   	});
	
	socket.on('switchRoom', function (newroom){
		var salaLlena = 0;

		for(var i=0 ; i < listaSala.length ; i++){
			if(listaSala[i].identificador == newroom){
				if(listaSala[i].player1 == ""){
					//console.log("Player1: %s", socket.user);
					listaSala[i].player1 = socket.user;
					listaSala[i].cantidadPlayer++;
					break;
				}
				else if(listaSala[i].player2 == ""){
					//console.log("Player2: %s", socket.user);
					listaSala[i].player2 = socket.user;
					listaSala[i].cantidadPlayer++;
					break;
				}
				else if(listaSala[i].player3 == ""){
					//console.log("Player3: %s", socket.user);
					listaSala[i].player3 = socket.user;	
					listaSala[i].cantidadPlayer++;
					break;
				}
				else if(listaSala[i].player4 == ""){
					//console.log("Player4: %s", socket.user);
					listaSala[i].player4 = socket.user;
					listaSala[i].cantidadPlayer++;
					break;
				}
				else{
					salaLlena = 1;
					break;
				}
			}
		}

		if(salaLlena == 0){
				socket.leave(socket.room);
				socket.join(newroom);
				socket.emit('updatechat', 'Servidor', 'Has ingresado a '+ newroom);
				socket.broadcast.to(socket.room).emit('updatechat', 'Servidor', socket.user+' ha dejado la sala');
				socket.room = newroom;
				socket.broadcast.to(newroom).emit('updatechat', 'Servidor', socket.user+' ha ingresado a la sala');

				deleteUserRoomPrincipal(socket.user);
		}
		else{
			socket.emit('updatechat', 'Servidor', 'No puede ingresar a esa sala... Ingrese a otra');
		}
	});

	socket.on('actPartida', function (partida){
		listaSala[idRoom(partida.identificador)] = partida;
		io.sockets.in(socket.room).emit('statisticsPlay', listaSala[idRoom(socket.room)]);
	});

	socket.on('nuevaPartida', function (partida){
		listaSala[idRoom(partida.identificador)].puntajeTeamA = 0;
		listaSala[idRoom(partida.identificador)].puntajeTeamB = 0;
		listaSala[idRoom(partida.identificador)].turnoA = 0;
		listaSala[idRoom(partida.identificador)].turnoB = 0;
		listaSala[idRoom(partida.identificador)].palabraTurno = "";
		io.sockets.in(socket.room).emit('startPlay', listaSala[idRoom(partida.identificador)]);
	});


	socket.on('validateNameServer', function(nombre){
		var validate;

		if(searchName(nombre) == "Yes")
			validate = "true";
		else
			validate = "false";

		socket.emit('receiveValidateName', validate);
	});

	socket.on('validateRoomServer', function(nombre){
		var validate;

		if(searchRoom(nombre) == "Yes")
			validate = "true";
		else
			validate = "false";

		socket.emit('receiveValidateRoom', validate);
	});

	socket.on('disconnect', function(){
		if(socket.play==0){
			socket.broadcast.to('Principal').emit('updateusers', userConect);
			socket.broadcast.to('Principal').emit('updatechat', 'Servidor', socket.user + ' se ha desconectado');
			//console.log("Delete Principal");
			deleteUserRoomPrincipal(socket.user);	
		}
		else
		{
			//console.log("DeleteR");
			io.sockets.in(socket.room).emit('updateusers', userRoom);
			io.sockets.in(socket.room).emit('updatechat', 'Servidor', socket.user + ' se ha desconectado');
			deleteUserRoom(socket.user, socket.room);
		}
		socket.leave(socket.room);
	});
	
});
