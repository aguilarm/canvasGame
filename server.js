var express = require('express'),
    app = express();

app.use('css', express.static(__dirname + '/css'));
app.use('js', express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
    console.log(process.env.IP);
});