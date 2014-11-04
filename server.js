var express = require('express'),
    app = express();

app.use(express.static(__dirname, 'client'));
app.use(express.static(__dirname, 'shared'));

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
    console.log(process.env.IP);
});