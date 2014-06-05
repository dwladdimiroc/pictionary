
var puerto = 8008; //comunica con el cliente, escucha

var io = require('socket.io').listen(puerto); //cargar libreria, porque se comunica mediante socket

var objetos = new Array();

function Pizarra(contenido,id,nombre) {

    var _nombreCompleto;
    var _color; 
	var integrantes = new Array();
	
 
    this.Contenido = contenido;
	this.Id=id;
    this.Nombre=nombre;
 
//hacer funcion que guarde los datos por si alguien se conecta y mire lo que estoy haciendo

	 this.getContenido = function () {
        return contenido;
    }
	 this.getNombre = function () {
        return nombre;
    }
	this.setNombre = function (color) {
         nombre = color;
    }
	this.getId = function () {
        return id;
    }
	this.setContenido = function (color) {
         contenido = color;
    }
	this.setIntegrantes = function (integrant) {
         integrantes.push(integrant);
    }
	this.getIntegrantes = function () {
         return integrantes;
    }
};




io.sockets.on('connection', function (socket) {
	
	socket.on('ejemplo1', function (data) {//varible data siempre va, recibe todo como string
		console.log(data);//muestra por consola lo recibido
		socket.emit('respuesta1', { respuesta: 'Yo Escribí '+data.text});//manda al cliente lo que recibio, mas el string "yo escribí"
	});
});

