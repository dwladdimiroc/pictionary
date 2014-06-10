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
    puntajePalabra: 0,

    listaJugar: 0
};

var time;
var escribe = 0;
var dibuja = 0;

      socket.on('connect', function(){
        //console.log("Reconnect");
        socket.emit('reconnectuser', username);
        //socket.emit('analizarPartida', username);
      });

      socket.on('startPlay', function (partida) {
      	//console.log("Start game");
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
          console.log("Click");
          console.log("Escribe "+escribe);
          var message = $('#data').val();
          $('#data').val('');
          if(juego.listaJugar == 0){
            socket.emit('sendchat', message);
          }
          else if (escribe==1)
          {
            if(juego.palabraTurno == message){
              detenerTiempo();
              if(juego.turnoA == juego.turnoB){
                juego.puntajeTeamA += juego.puntajePalabra;
              }
              else
              {
                juego.puntajeTeamB += juego.puntajePalabra;
              }
              alert("¡Has acertado con el dibujo!");  
              socket.emit('sendchat', message);
              gestionarTurno();             
            }
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
        //console.log("Iniciar partida");
        socket.emit('actPartida',juego);
        var player = identificarPlayer(username);
        gestionarTurno(player);
      }

      function gestionarTurno(player){
      	//console.log("Gestionar turno");
        
        console.log("Palabra Turno: "+juego.palabraTurno);
        //Determinar banderas
        //console.log("TurnoA "+juego.turnoA);
        //console.log("TurnoB "+juego.turnoB);
        console.log("Player "+player);
        if ( juego.turnoA == juego.turnoB ){
          if (juego.turnoA % 2 == 0){
            if(player==1){
              alert("Debes dibujar la siguiente palabra: "+juego.palabraTurno);
              dibuja=1;
              socket.emit('actPartida',juego);
            }
            else if (player==2){
              alert("Deberás adivinar el dibujo que realizará tu compañero de equipo");
              escribe=1;
            }
          } else {
            if(player==1){
              alert("Deberás adivinar el dibujo que realizará tu compañero de equipo");
              escribe=1;
            }
            else if (player==2)
            {
              alert("Debes dibujar la siguiente palabra: "+juego.palabraTurno);
              dibuja=1;
              socket.emit('actPartida',juego);
            }
            else{
              socket.emit('actPartida',juego);
            }
          }
        }
        else
        {
          if (juego.turnoB % 2 == 0){
            if(player==3){
              alert("Debes dibujar la siguiente palabra: "+juego.palabraTurno);
              dibuja=1;
              socket.emit('actPartida',juego);
            }
            else if (player==4){
              alert("Deberás adivinar el dibujo que realizará tu compañero de equipo");
              escribe=1;
            }
          } else {
            if(player==3){
              alert("Deberás adivinar el dibujo que realizará tu compañero de equipo");
              escribe=1;
            }
            else if (player==4)
            {
              alert("Debes dibujar la siguiente palabra: "+juego.palabraTurno);
              dibuja=1;
              socket.emit('actPartida',juego);
            }
            else{
              socket.emit('actPartida',juego);
            }
          }
        }

        iniciarTiempo();;

      }

      function iniciarTiempo (){
        alert("Comienzan los 30 segundos... Go!");
        time = setTimeout(function(){
          alert("Perdió su turno... :( La palabra era "+juego.palabraTurno);
          if ( juego.turnoA == juego.turnoB ){
            juego.turnoA++;
          }
          else
          {
            juego.turnoB++;
          }
          if(juego.turnoA == 3 && juego.turnoB == 3){
            mostrarResultados();
            socket.emit('actPartida',juego);
            socket.emit('nuevaPartida',juego);
          }
          gestionarTurno();
        }, 1000000);
      }

      function mostrarResultados(){
        if(juego.puntajeTeamA < juego.puntajeTeamB){
          alert("Esto ha sido victor del equipo B, un puntaje de "+juego.puntajeTeamB+" contra "+juego.puntajeTeamA+" del equipo A");
        }
        else if(juego.puntajeTeamA < juego.puntajeB){
          alert("Esto ha sido victor del equipo A, un puntaje de "+juego.puntajeTeamA+" contra "+juego.puntajeTeamB+" del equipo B");
        }
        else{
          alert("¡Señooreeees esto ha sido empate!");
        }
      }

      function detenerTiempo(){
        clearTimeout(time);
      }

      function identificarPlayer (username){
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

