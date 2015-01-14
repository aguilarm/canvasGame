var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);
    
app.use('css', express.static(__dirname + '/css'));
app.use('js', express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('New user: ' + socket.id);
    console.log(socket.client.request.headers['x-forwarded-for']);
    socket.on('playerUpdate', function (player) {
        console.log(player.pos);
    });
    socket.on('disconnect', function () {
        console.log(socket.id + 'has disconnected!');
    });
});

app.set('port', process.env.PORT || 3000);

http.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + http.address().port);
    console.log(process.env.IP);
});