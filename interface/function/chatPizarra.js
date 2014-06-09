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

    turnoA: 1,
    turnoB: 0,

    palabraTurno: "",

    listaJugar: 0
};

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
          socket.emit('sendchat', message);
        });

        $('#data').keypress(function(e) {
          if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
          }
        });
      }); 

      function iniciarPartida(){
        var frase;

        if(username == juego.player1){

        }
        else if(username == juego.player2){

        }
        else if(username == juego.player3){

        }
        else if(username == juego.player4){

        }
      }

      /*function generaRandom(){
    
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

        socket.emit('play', random);
      }*/
