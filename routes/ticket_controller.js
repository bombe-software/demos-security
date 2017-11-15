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
	var bytes  = CryptoJS.AES.decrypt(request.body.data, 'jaiba');
	var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

	console.log(decryptedData.params);

	con.query('select * from Usuario where email = ? && contrasena = ?',
	    [
	      decryptedData.params.CorreoElectronico,
	      decryptedData.params.Contrasena
	    ],
	    function Query(error, rows) {
	      response.end(JSON.stringify(rows));
	    }
	);
	
};
