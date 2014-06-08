var socket = io.connect('http://192.168.1.136:8085');

//var cantidadUser = 0;

      socket.on('connect', function(){
        socket.emit('adduser', username);
      });

      socket.on('updatechat', function (username, data) {
        $('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
      });

      socket.on('updaterooms', function(rooms, current_room) {
        $('#rooms').empty();
        $.each(rooms, function(key, value) {
          if(value == current_room){
            $('#rooms').append('<div>' + value + '</div>');
          }
          else {
            $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
          }
        });
      });

      socket.on('updateusers', function(usernames) {
        $('#usernames').empty();
        $.each(usernames, function(key, value) {
            $('#usernames').append('<div>' + value + '</div>');;
        });
      });

      /*socket.on('cantuser', function(usernames) {
        $.each(usernames, function(key, value) {
            cantidadUser++;
        });
      });*/

      function switchRoom(room){
        socket.emit('switchRoom', room);
      }

      $(function(){
        $('#ctduser').click( function() {
          socket.emit('userRoom');
          //socket.emit('sendchat', cantidadUser);
          //cantidadUserRoom = 0;
        });
        //alert(cantidadUser);
      });
      
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
        $('#crearsala').click( function() {
          var sala = $('#CrearSala').val();
          $('#CrearSala').val('');
          socket.emit('create', sala);
        });
      });
