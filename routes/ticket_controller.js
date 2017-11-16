//Configurar de la base de datos
var mysql = require('mysql');
var CryptoJS = require("crypto-js");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "n0m3l0",
  database: "Demos"
});

con.connect(function (err) {
  if (err) {
    console.log("Error conexion base");
    return;
  }
  console.log('Conexion establecida en login');
});



//{"D":5,"E":5,"N":21}
exports.post = function (request, response) {
	//response.writeHead(200, { 'Content-Type': 'application/json' });
	//var bytes  = CryptoJS.AES.decrypt(request.body.data, 'jaiba');
	//var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	let ip = request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	con.query('select  * from Usuario  where email = ?',
	    [
	      request.body.correo_electronico
	    ],
	    function Query(error, rows) {
				if(JSON.stringify(rows) != '[]'){
					let usuario = JSON.parse(JSON.stringify(rows[0]));
					let data =  {ticket: CryptoJS.AES.encrypt(JSON.stringify(
						{
							direccion_cliente: ip,
							route: request.body.route
						}
						), "jaiba").toString()};
					response.end(CryptoJS.AES.encrypt(JSON.stringify(data), usuario.contrasena).toString());	
				}else{
					response.end("404");
				}
			}
	);	
};

