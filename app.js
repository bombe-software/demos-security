/**
 * Configuracion basica de express y Socket.io
 */
var app = require('express')();
var http = require('http').Server(app);
var bodyParser =  require("body-parser");

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
 *	Configuracion de las rutas
 */ 
var ticket_controller  = require("./routes/ticket_controller");
app.post('/ticket_controller', ticket_controller.post);

var exmple  = require("./routes/exmple");
app.get('/example', exmple.post);
 
/*
 *	Poner a la escucha el servidor 
 */
http.listen(5000, function(){
  console.log('listening on *:5000');
});






