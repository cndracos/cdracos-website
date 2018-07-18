var multiplier;

function round(value, scale) {
    return (value).toPrecision(scale);
}

class SphereCryptor {
    static bounceMessage(message, p, v, difficulty) {
        multiplier = ByteUtilities.toByteArray(this.pointFunction(p.x, p.y, p.z));

        for (var j = 0; j < message.length; j++) {
            message[j] = Math.abs((message[j] ^ (multiplier[(j % 2) + 1] * (j + 1))) % 128);
        }

        return difficulty == 1 ? message : this.bounceMessage(message, this.calcNextPoint(p, v),
            v.reflect(p), difficulty - 1);
    }

    static pointFunction(x, y, z) {
        return (x * y + 1) / (z * z + 1);
    }

    static  calcNextPoint(p, v) {
        let d = round(v.a * v.a + v.b * v.b + v.c * v.c, 21);
        let e = round(2 * (v.a * p.x + v.b * p.y + v.c * p.z), 21);
        let f = round(p.x * p.x + p.y * p.y + p.z * p.z - 1, 21);
        let t = this.quadFormula(d, e, f);

        p.x += v.a * t;
        p.y += v.b * t;
        p.z += v.c * t;

        return p;
    }

    static quadFormula(a, b, c) {
        let x = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        let y = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        return x == 0 ? y : x;
    }
}

class Encryptor extends SphereCryptor {
    static encrypt(message, difficulty) {
        var messageBytes = ByteUtilities.toMessageBytes(message.trim());
        console.log(messageBytes);

        var p = new Point(Math.random(), Math.random(), Math.random()).normalize();
        var v = new Vector(-Math.random(), -Math.random(), -Math.random());

        messageBytes = this.bounceMessage(messageBytes, p, v, difficulty);
        console.log("Encrypted Point: ", p.x, p.y, p.z);
        console.log("Encrypted Vector: ", v.a, v.b, v.c);
        console.log("Encrypted message bytes: ", messageBytes);

        var finalMessage = "";
        finalMessage += ByteUtilities.toHexStringFromDouble(round(p.x, 16));
        finalMessage += ByteUtilities.toHexStringFromDouble(round(p.y, 16));
        finalMessage += ByteUtilities.toHexStringFromDouble(round(p.z, 16));

        finalMessage += ByteUtilities.toHexStringFromDouble(round(v.a, 16));
        finalMessage += ByteUtilities.toHexStringFromDouble(round(v.b, 16));
        finalMessage += ByteUtilities.toHexStringFromDouble(round(v.c, 16));

        finalMessage += ByteUtilities.toHexStringFromByteArray(ByteUtilities.toByteArray(difficulty).slice(0, 4));
        finalMessage += ByteUtilities.toHexStringFromByteArray(messageBytes);
        return finalMessage;
    }
}

class Decryptor extends SphereCryptor {
    static decrypt(hexMessage) {
        var hexMessageBytes = ByteUtilities.parseHexString(hexMessage);

        var px = ByteUtilities.toDoubleFromByteArray([hexMessageBytes[0], hexMessageBytes[1]]);
        var py = ByteUtilities.toDoubleFromByteArray([hexMessageBytes[2], hexMessageBytes[3]]);
        var pz = ByteUtilities.toDoubleFromByteArray([hexMessageBytes[4], hexMessageBytes[5]]);
        var p = new Point(px, py, pz);
        console.log("Decrypted Point: ", px, py, pz);

        var va = -ByteUtilities.toDoubleFromByteArray([hexMessageBytes[6], hexMessageBytes[7]]);
        var vb = -ByteUtilities.toDoubleFromByteArray([hexMessageBytes[8], hexMessageBytes[9]]);
        var vc = -ByteUtilities.toDoubleFromByteArray([hexMessageBytes[10], hexMessageBytes[11]]);
        var v = new Vector(va, vb, vc);
        console.log("Decrypted Vector: ", va, vb, vc);

        var difficulty = ByteUtilities.toDoubleFromByteArray([hexMessageBytes[12], 0]);

        this.calcNextPoint(p, v);
        v = new Vector(-v.a, -v.b, -v.c);

        let hexx = hexMessage.slice(104);
        var messageBytes = this.hex2a(hexx);
        console.log("Decrypted message bytes: ", messageBytes);
        messageBytes = this.bounceMessage(messageBytes, p, v, difficulty);

        function parseStringBytes(messageBytes) {
            var message = "";
            for (var i = 0; i < messageBytes.length; i++) {
                message += String.fromCharCode(messageBytes[i]);
            }
            return message;
        }

        console.log("Final bytes: ", messageBytes);

        return parseStringBytes(messageBytes);
    }

    static hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return ByteUtilities.toMessageBytes(str);
    }
}

class ByteUtilities{
    static toMessageBytes(message) {
        var bytes = [];
        for (var i = 0; i < message.length; i++) {
            var code = message.charCodeAt(i);
            bytes = bytes.concat([code]);
        }
        return bytes;
    }

    static toByteArray(value) {
        var buffer = new ArrayBuffer(8);         // JS numbers are 8 bytes long, or 64 bits
        var longNum = new Float64Array(buffer);  // so equivalent to Float64

        longNum[0] = value;

        return Array.from(new Int8Array(buffer)).reverse();
    }

    static toDoubleFromByteArray(byteArray) {
        let a = byteArray[0];
        let b = byteArray[1];
        let e = (a >> 52 - 32 & 0x7ff) - 1023;

        return (a & 0xfffff | 0x100000) / Math.pow(2,52-32) * Math.pow(2, e) +
        b * 1.0 / Math.pow(2, 52) * Math.pow(2, e);
    }

    static parseHexString(str) {
        var result = [];
        while (str.length >= 8) {
            result.push(parseInt(str.substring(0, 8), 16));

            str = str.substring(8, str.length);
        }

        return result;
    }

    static toHexStringFromByteArray(byteArray) {
        return Array.from(byteArray, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
    }

    static toHexStringFromDouble(value) {
        return this.toHexStringFromByteArray(this.toByteArray(value));
    }
}

class Vector{
    constructor(a, b, c) {
        this.a = a; this.b = b; this.c = c;
    }

    reflect(other) {
        let scaledPoint = other.scale(2 * this.dot(other));
        this.mutate(scaledPoint.x, scaledPoint.y, scaledPoint.z, (v, p) => v - p);
        return this;
    }

    dot(other) {
        return this.a * other.x + this.b * other.y + this.c * other.z;
    }

    mutate(x, y, z, func) {
        this.a = func(this.a, x); this.b = func(this.b, y); this.c = func(this.c, z);
    }
}

class Point {
    constructor(x, y, z) {
        this.x = x; this.y = y; this.z = z;
    }

    scale(value) {
        return new Point(this.x * value, this.y * value, this.z * value);
    }

    normalize() {
        let magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x /= magnitude; this.y /= magnitude; this.z /= magnitude;
        return this;
    }
}