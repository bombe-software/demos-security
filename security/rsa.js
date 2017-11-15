exports.generatorKeys = function (p, q) {
	let n = p *q;
    let phi = (p-1)*(q-1);
        
    let j = 0;
    let e = 0;
    for (let i = 1; j==0; i++) {
        j = phi%i;
        e = i;
    }
        
    let d = 2.5;
    for (let i = 1; d%1!=0; i++) {
        d = ((i*phi)+1)/e;
    }
    return { D:d, E:e, N:n }
};
exports.stringToASCIICifrado = function(n, clave, m){
    var string = '';
    for (var i = n.length - 1; i >= 0; i--) {
        ascii += (Math.pow(n.charCodeAt(i), clave)%m).toString();
    };
    return string;
}