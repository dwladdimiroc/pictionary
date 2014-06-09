var socket = io.connect('http://192.168.2.4:8085');

var juego = {
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

    listaJugar: 0
};

var escribe=0;
var dibuja=0;

      socket.on('connect', function(){
        //console.log("Reconnect");
        socket.emit('reconnectuser', username);
        //socket.emit('analizarPartida', username);
      });

      socket.on('startPlay', function (partida) {
        juego = partida;
        iniciarPartida();
      });

      socket.on('updatechat', function (username, data) {
        $('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
      });

      socket.on('updateusers', function (usernames) {
        $('#usernames').empty();
        $.each(usernames, function(key, value) {
            $('#usernames').append('<div>' + value + '</div>');
        });
      });

      socket.on('statisticsPlay', function (partida) {
        $('#game').empty();
        $.each(partida, function(key, value) {
            $('#game').append('<div>' + key + ': ' + value + '</div>');
        });
      });
      
      $(function(){
        $('#datasend').click( function() {
          //console.log("Click");
          var message = $('#data').val();
          //console.log("Mensaje: %s",message);
          $('#data').val('');
          if(juego.listaJugar == 0){
            socket.emit('sendchat', message);
          }
          else if (escribe==1)
          {
            palabraTurno = message;
            var respuesta = "¡Has acertado con el dibujo!";
            socket.emit('sendchat', respuesta);
            socket.emit('sendchat',message);
          }
        });

        $('#data').keypress(function(e) {
          if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
          }
        });
      }); 

      function iniciarPartida(){
        console.log("Datos: "+username);
        juego.listaJugar = 1;
        socket.emit('actPartida',juego);
        turno();
      }

      function turno(){
        var player = identificarPlayer(username);
        //Determinar banderas
        if ( juego.puntajeTeamA == juego.puntajeTeamB ){
          if (juego.puntajeTeamA % 2 == 0){
            if(player==1){
              alert("Debes dibujar la siguiente palabra: ")
              dibuja=1;
            }
            else if (player==2){
              alert("Deberás adivinar el dibujo que realizará tu compañero de equipo")
              escribe=1;
            }
          } else {
            if(player==1){
              alert("Deberás adivinar el dibujo que realizará tu compañero de equipo")
              escribe=1;
            }
            else if (player==2)
            {
              alert("Debes dibujar la siguiente palabra: ")
              dibuja=1;
            }
          }
        }
        else
        {
          if (juego.puntajeTeamB % 2 == 0){
            if(player==3){
              alert("Deberás adivinar el dibujo que realizará tu compañero de equipo")
              dibuja=1;
            }
            else if (player==4){
              alert("Debes dibujar la siguiente palabra: ")
              escribe=1;
            }
          } else {
            if(player==3){
              alert("Debes dibujar la siguiente palabra: ")
              escribe=1;
            }
            else if (player==4)
            {
              alert("Deberás adivinar el dibujo que realizará tu compañero de equipo")
              dibuja=1;
            }
          }
        }
      }

      function identificarPlayer (username){
        //console.log(username);
        //console.log(juego.player1);
        //console.log(juego.player2);
        if(juego.player1 == username){
          return 1;
        }
        else if(juego.player2 == username){
          return 2;
        }
        else if(juego.player3 == username){
          return 3;
        }
        else if(juego.player4 == username){
          return 4;
        }
        return 0;
      }

      function generaRandom(){
    
        var palabra;
        var numero = consultas[Math.floor(Math.random() * consultas.length)];
        if (consultas==1) {
          palabra = animales[Math.floor(Math.random() * animales.length)];
        }
        else if (consultas==2)
        {
          palabra = objeto[Math.floor(Math.random() * objeto.length)];
        }

        else if (consultas==3)
        {
          palabra = accion[Math.floor(Math.random() * accion.length)];
        }
        else if (consultas==4)
        {
          palabra = profesion[Math.floor(Math.random() * profesion.length)];
        }
        else 
        {
          palabra = random[Math.floor(Math.random() * random.length)];
        }

        return palabra;
      }
