/**
 * Configuracion basica de express y Socket.io
 */
var app = require('express')();
var http = require('http').Server(app);
var bodyParser =  require("body-parser");

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000, http://localhost:8080');

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
var encrypted  = require("./routes/encrypted");
app.get('/des', encrypted.des);
 
/*
 *	Poner a la escucha el servidor 
 */
http.listen(5000, function(){
  console.log('listening on *:5000');
});






