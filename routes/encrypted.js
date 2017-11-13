var encriptador  = require("./../security/des").des;
exports.des = function (request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    let clave  = "0001001100110100010101110111100110011011101111001101111111110001";
    let cadena = "0000000100100011010001010110011110001001101010111100110111101111";

    console.log(cadena == encriptador.desicifrar(encriptador.cifrar(cadena, clave), clave));
    response.end("Todo bien");
};