var socket = io.connect('http://192.168.2.4:8085');
var valRoom = "nn";

//var cantidadUser = 0;

      socket.on('connect', function(){
        socket.emit('adduser', username);
      });

      socket.on('updatechat', function (username, data) {
        $('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
      });

      socket.on('updaterooms', function(user, rooms, current_room) {
        $('#rooms').empty();
        $.each(rooms, function(key, value) {
          if(value == current_room){
            $('#rooms').append('<div>' + value + '</div>');
          }
          else {
            $('#rooms').append('<div><a href="sala-pizarra?nick='+user+'" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
          }
        });
      });

      socket.on('updateusers', function (usernames) {
        $('#usernames').empty();
        $.each(usernames, function(key, value) {
            $('#usernames').append('<div>' + value + '</div>');
        });
      });

      function switchRoom(room){
        socket.emit('switchRoom', room);
        //socket.emit('play', {});
      }
      
      $(function(){
        $('#datasend').click( function() {
          var message = $('#data').val();
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

      $(function(){
        $('#createRoom').click( function() {
          var sala = $('#nameRoom').val();
          //$('#nameRoom').val('');

          socket.emit('validateRoomServer', sala);
          if(valRoom == "true"){
            alert("Su sala ya se encuentra utilizado en el sistema...")
          }
          else{
            alert(sala+" has sido ingresado exitosamente");
            socket.emit('create', sala);
          }
        });
      });
