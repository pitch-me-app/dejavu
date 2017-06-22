'use strict';

const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use('/dist', express.static(__dirname + '/live/dist'));
app.use('/', express.static(__dirname + '/live'));
app.use('/bundle', express.static(__dirname + '/bundle'));

app.get('*', function(req, res){
    res.sendFile(__dirname + '/live/index.html');
});

app.listen(app.get('port'), function () {
  console.log('Listening on PORT: ' + app.get('port'))
});

