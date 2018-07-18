function round(value, scale) {
    return (value).toPrecision(scale);
}

class SphereCryptor {
    static bounceMessage(message, p, v, difficulty) {
        let multiplier = ByteUtilities.toByteArray(this.pointFunction(p.x, p.y, p.z));

        for (var j = 0; j < message.length; j++) {
            message[j] ^= (multiplier[(j % 2) + 1] * (j + 1));
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

class Encyptor extends SphereCryptor {
    static encrypt(message, difficulty) {
        var messageBytes = ByteUtilities.toMessageBytes(message.trim());

        var p = new Point(Math.random(), Math.random(), Math.random());
        var v = new Vector(-Math.random(), -Math.random(), -Math.random());

        messageBytes = this.bounceMessage(messageBytes, p, v, difficulty);

        var finalMessage = "";
        finalMessage += ByteUtilities.toHexString(ByteUtilities.toByteArray(p.x));
        finalMessage += ByteUtilities.toHexString(ByteUtilities.toByteArray(p.y));
        finalMessage += ByteUtilities.toHexString(ByteUtilities.toByteArray(p.z));

        finalMessage += ByteUtilities.toHexString(ByteUtilities.toByteArray(v.a));
        finalMessage += ByteUtilities.toHexString(ByteUtilities.toByteArray(v.b));
        finalMessage += ByteUtilities.toHexString(ByteUtilities.toByteArray(v.c));

        finalMessage += ByteUtilities.toHexString(ByteUtilities.toByteArray(difficulty).slice(0, 2));
        finalMessage += ByteUtilities.toHexString(messageBytes);
        return finalMessage;
    }
}

class Decryptor extends SphereCryptor {
    static decrypt(hexMessage) {
        var messageBytes = ByteUtilities.parseHexString(hexMessage);
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

    static toHexString(byteArray) {
        return Array.from(byteArray, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
    }

    static parseHexString(str) {
        var result = [];
        while (str.length >= 8) {
            result.push(parseInt(str.substring(0, 8), 16));

            str = str.substring(8, str.length);
        }

        return result;
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