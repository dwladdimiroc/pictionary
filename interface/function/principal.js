var socket = io.connect('http://192.168.2.4:8085');

var valNick = "nn";

socket.on('receiveValidateName', function (data) {
	valNick = data;
});

function validateName(){
	var name = document.forms["user"]["nick"].value;
	socket.emit('validateNameServer', name);

	//setTimeout(function(){
		if(valNick == "true"){
			alert("Su nick ya se encuentra utilizado en el sistema...")
			return false;
		}
		else{
			alert(name+" has sido ingresado exitosamente");
			return true;
		}
	//}, 500);
	return false;
}