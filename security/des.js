class Cerrajero {

    generarClaves(clave) {
        //Transformar la clave de 64 bits en un binario
        //console.log("Clavesita" + clave);
        let claves = [];
        let claveBinaria = clave;

        if (claveBinaria.length != 64) {
            let n = 64 - claveBinaria.length;
            for (let i = 0; i < n; i++) {
                claveBinaria = "0" + claveBinaria;
            }
        }

        //Hacer una reduccion cad 8 bits para tener un clave de 56 bits
        let reduccion = "";
        for (let i = 0; i < claveBinaria.length; i++) {
            if ((i + 1) % 8 != 0) {
                reduccion = + claveBinaria[i];
            }
        }

        //Hacer la primera permutacion
        //let clavePermutadaU = claveBinaria;

        let clavePermutadaU = new Permutador().PC_1(claveBinaria);

        //Dividir en dos bloques
        let c = clavePermutadaU.substring(0, 28);
        let d = clavePermutadaU.substring(28, 56);


        //Se hace un  currimiento para obtener 16 claves c
        let c_recorrida = [];
        c_recorrida[0] = this.currimiento(c, 0);
        for (let i = 1; i < 16; i++) {
            c_recorrida[i] = this.currimiento(c_recorrida[i - 1], i);
        }

        //Se hace un  currimiento para obtener 16 claves c
        let d_recorrida = [];
        d_recorrida[0] = this.currimiento(d, 0);
        for (let i = 1; i < 16; i++) {
            d_recorrida[i] = this.currimiento(d_recorrida[i - 1], i);
        }

        //Se unen las respectivas claves  c y d, 
        //despues de meten a la caja de permutación
        for (let i = 0; i < 16; i++) {
            claves[i] = this.permutacion_subclaves(c_recorrida[i], d_recorrida[i]);
        }

        return claves;
    }



    currimiento(subclave, i) {
        let TC_1 = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
        for (let j = 0; j < TC_1[i]; j++) {
            subclave = subclave.substring(1, subclave.length) + subclave[0];
        }
        return subclave;
    }

    permutacion_subclaves(c, d) {
        let subclave = c + d;
        let res = new Permutador().PC_2(subclave);
        return res;
    }
}
class Feistel {

    cifrado(cadena, clave) {
        let claves = new Cerrajero().generarClaves(clave);
        for (let i = 0; i < claves.length; i++) {
            cadena = this.aplicarLlave(cadena, claves[i]);

        }
        return cadena;
    }

    /**
     * Aplica un descifrado feistel a una cadena y genera las claves apartir de
     * la principal
     * @param cadena es una cadena a la que aplicarle el feistel
     * @param clave es la clave del feistel
     * @return es la cadena descifrada
     */
    descifrado(cadena, clave) {
        let claves = new Cerrajero().generarClaves(clave);
        for (let i = claves.length - 1; i >= 0; i--) {
            cadena = this.aplicarLlave(cadena, claves[i]);
        }
        return cadena;


    }


    /**
     * Es el algoritmo feistel aplicado a DES
     * @param cadena recibe una cadena la cadena aplicar el feiste
     * @param clave es la llave del feistel
     * @return una cadena a la que se le aplico una llave
     */
    aplicarLlave(cadena, clave) {

        let Lo = cadena.substring(0, 32);
        let Ro = cadena.substring(32, 64);

        //Se realiza la expansion a 48 bits
        let Ri = new Permutador().E(Ro);

        // Se realiza el xor con la clave
        Ri = this.XOR(Ri, clave);

        Ri = new Sustituidor().sustitucion(Ri);

        //Se realiza la permutacion P a Ri
        Ri = new Permutador().P(Ri);

        //Aplicar Xor Lo con Ri
        Ri = this.XOR(Lo, Ri);
        //Concatener de manera invertida
        return Ro + Ri;
    }


    /**
     * Aplica un Xor sin pasar a binario los datos, suponiendo que ambas cadenas
     * son iguales
     *
     * @param binario_1 Un bloque de bits del mismo tamaño que binario_2
     * @param binario_2 Un bloque de bits del mismo tamaño que binario_1
     * @return
     */
    XOR(binario_1, binario_2) {
        //StringBuilder resultado = new StringBuilder();

        let resultado = "";
        for (let i = 0; i < binario_1.length; i++) {

            if (binario_1.charAt(i) == binario_2.charAt(i)) {
                //resultado.append('0');
                resultado += '0';
            } else {
                //resultado.append('1');
                resultado += '1';
            }
        }

        return resultado.toString();
    }
}
class Parseador {

    checkBin(n) {
        return /^[01]{1,64}$/.test(n)
    }

    checkDec(n) {
        return /^[0-9]{1,64}$/.test(n)
    }

    checkHex(n) {
        return /^[0-9A-Fa-f]{1,64}$/.test(n)
    }

    pad(s, z) {
        s = "" + s;
        return s.length < z ? pad("0" + s, z) : s
    }

    unpad(s) {
        s = "" + s;
        return s.replace(/^0+/, '')
    }

    Dec2Bin(n) {
        if (!this.checkDec(n) || n < 0)
            return 0;
        return n.toString(2)
    }

    Dec2Hex(n) {
        if (!this.checkDec(n) || n < 0)
            return 0;
        return n.toString(16)
    }

    Bin2Dec(n) {
        if (!this.checkBin(n))
            return 0;
        return parseInt(n, 2).toString(10)
    }

    Bin2Hex(n) {
        if (!this.checkBin(n))
            return 0;
        return parseInt(n, 2).toString(16)
    }

    //Hexadecimal Operations
    Hex2Bin(n) {
        if (!this.checkHex(n))
            return 0;
        return parseInt(n, 16).toString(2);
    }

    Hex2Dec(n) {
        if (!this.checkHex(n))
            return 0;
        return parseInt(n, 16).toString(10)
    }

    hexToBin(n) {
        if (!this.checkHex(n))
            return 0;
        return parseInt(n, 16).toString(2);
    }

    binToHex(n) {
        if (!this.checkBin(n))
            return 0;
        return parseInt(n, 2).toString(16)
    }

}
class Permutador {
    /**
     * Funcion generica para permutar
     * @param CajaPermutacion es una caja de permutacion
     * @param cadena es la cadena que quiere ser permutada
     * @return la cadena permutada
     */
    permutar(CajaPermutacion, cadena) {
        //Se realiza una permutacion
        let cadenaPermutada = "";
        for (let i = 0; i < CajaPermutacion.length; i++) {
            cadenaPermutada += cadena.charAt(CajaPermutacion[i] - 1);
        }

        return cadenaPermutada;
    }

    /**
     * Permutacion especifica para PC_1
     * @param cadena es la cadena que quiere ser permutada
     * @return la cadena permutada
     */
    PC_1(cadena) {
        //Tabla de permutacion 1 para las claves 
        let PC_1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4];
        return this.permutar(PC_1, cadena);
    }

    /**
     * Permutacion especifica para PC_2
     * @param cadena es la cadena que quiere ser permutada
     * @return la cadena permutada
     */
    PC_2(cadena) {
        //Tabla de permutacion 2 para las claves
        let PC_2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];
        return this.permutar(PC_2, cadena);
    }

    /**
     * Permutacion especifica para IP
     * @param cadena es la cadena que quiere ser permutada
     * @return la cadena permutada
     */
    IP(cadena) {
        //Tabla de permutacion IP para la cadena 
        let IP = [58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7];
        return this.permutar(IP, cadena);
    }

    /**
     * Permutacion especifica para E
     * @param cadena es la cadena que quiere ser permutada
     * @return la cadena permutada
     */
    E(cadena) {
        //Tabla de expansion para la cadena
        let E = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];
        return this.permutar(E, cadena);
    }

    /**
     * Permutacion especifica para P
     * @param cadena es la cadena que quiere ser permutada
     * @return la cadena permutada
     */
    P(cadena) {
        // Tabla permutacion P para la cadena
        let P = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25];
        return this.permutar(P, cadena);
    }

    /**
     * Permutacion especifica para IP_1
     * @param cadena es la cadena que quiere ser permutada
     * @return la cadena permutada
     */
    IP_1(cadena) {
        let IP_1 = [40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25];
        return this.permutar(IP_1, cadena);
    }

}
class Sustituidor {



    /**
     * Se divide el cadena en 8 bloques de 6 bits y se realiza la sustitucion
     * para obtener 8 bloques de 4 bits estos se vuelven a unir y se retornan
     *
     * @param cadena es la cadena que se desea sustituir
     * @return la cadena sustituida
     */
    sustitucion(cadena) {
        return this.sustitucion_x_caja(cadena.substring(0, 6), 0)
            + this.sustitucion_x_caja(cadena.substring(6, 12), 1)
            + this.sustitucion_x_caja(cadena.substring(12, 18), 2)
            + this.sustitucion_x_caja(cadena.substring(18, 24), 3)
            + this.sustitucion_x_caja(cadena.substring(24, 30), 4)
            + this.sustitucion_x_caja(cadena.substring(30, 36), 5)
            + this.sustitucion_x_caja(cadena.substring(36, 42), 6)
            + this.sustitucion_x_caja(cadena.substring(42, 48), 7);
    }

    /**
     * Es un algoritmo de sustitucio para s_boxes
     *
     * @param bits_6 es una cadena de 6 bits que quiere ser sustituida
     * @param ref es una referencia a que lugar en el bloque principal ocupa
     * @return Una cadena de 4 bits sustituida en los s_boxes
     */
    sustitucion_x_caja(bits_6, ref) {
        // Tabla de s boxes
        let S = [[
            [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
            [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
            [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
            [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
        ], [
            [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
            [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
            [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
            [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
        ], [
            [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
            [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
            [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
            [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
        ], [
            [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
            [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
            [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
            [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
        ], [
            [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
            [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
            [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
            [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
        ], [
            [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
            [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
            [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
            [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
        ], [
            [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
            [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
            [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
            [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
        ], [
            [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
            [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
            [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
            [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
        ]];
        let s_box = S[ref];
        //StringBuilder filaBuilder = new StringBuilder();
        let filaBuilder = "";
        //filaBuilder.append(bits_6.charAt(0));
        filaBuilder += bits_6[0];
        //filaBuilder.append(bits_6.charAt(5));
        filaBuilder += bits_6[5];

        let fila = parseInt(filaBuilder, 2).toString(10);
        let columna = parseInt(bits_6.substring(1, 5), 2).toString(10);


        let s = s_box[fila][columna];
        //Esta linea
        let s_binario = s.toString(2);


        if (s_binario.length != 4) {
            let n = 4 - s_binario.length;
            for (let i = 0; i < n; i++) {
                s_binario = "0" + s_binario;
            }
        };

        return s_binario;
    }

}

class DES {

    cifrar(cadena, clave) {
        //let cadenas64 = new Parseador().hexToBin(cadena);
        // console.log("Binario " + cadenas64);

        let cifradoAnt = this.cifrar_64(cadena, clave);

        return cifradoAnt;
    }

    /**
     * Permite desencriptar cadenas largas mayores a 64 bits
     *
     * @param cadena La cadena a desencriptar
     * @param clave La clave del desencriptado
     * @return La cadena ya desencriptada
     */
    desicifrar(cadena, clave) {

        //let cadenas64 = new Parseador().hexToBin(cadena);

        let cifradoAnt = this.descifrar_64(cadena, clave);

        return cifradoAnt;
    }

    /**
     * Encipta los bloques de solo 64 bits
     *
     * @param cadena Recibe una cadena en forma de binario de 64 bits
     * @param clave Recibe una clave de 48 bits
     * @return un bloque el 64 bits encriptado
     */
    cifrar_64(cadena, clave) {
        //Aplicar permutacion IP

        let cadenaPermutada = new Permutador().IP(cadena);
        //console.log('cadenitas' + cadenaPermutada).
        // Aplicar las 16 claves

        let cadenaPermutada_1 = new Feistel().cifrado(cadenaPermutada, clave);


        //Invertir la cadena R(16)L(16)
        let cadenaPermutada_2 = cadenaPermutada_1.substring(32, 64) + cadenaPermutada_1.substring(0, 32);

        //Permutacion final
        let encriptado = new Permutador().IP_1(cadenaPermutada_2);

        return encriptado;
    }

    /**
     * Encipta los bloques de solo 64 bits
     *
     * @param cadena Recibe una cadena en forma de binario de 64 bits
     * @param clave Recibe una clave de 48 bits
     * @return un bloque el 64 bits descifrado
     */
    descifrar_64(cadena, clave) {
        let cadenaPermutada = new Permutador().IP(cadena);
        //console.log('cadenitas' + cadenaPermutada).
        // Aplicar las 16 claves

        let cadenaPermutada_1 = new Feistel().descifrado(cadenaPermutada, clave);


        //Invertir la cadena R(16)L(16)
        let cadenaPermutada_2 = cadenaPermutada_1.substring(32, 64) + cadenaPermutada_1.substring(0, 32);

        //Permutacion final
        let encriptado = new Permutador().IP_1(cadenaPermutada_2);

        return encriptado;
    }

}

exports.des = new DES();
