"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x = 0, y = 0) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    normalize() {
        const magnitude = this.magnitude;
        if (magnitude !== 0) {
            this.x = this.x / magnitude;
            this.y = this.y / magnitude;
        }
    }
    cPerpRotation() {
        //clockwise Perpendicular rotation
        return new Vector(this.y, -this.x);
    }
    cCPerpRotation() {
        //counterClockwise Perpendicular rotation
        return new Vector(-this.y, this.x);
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    reset() {
        return this.set(0, 0);
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    add(a, b) {
        if (a instanceof Vector) {
            this.x += a.x;
            this.y += a.y;
        }
        else {
            this.x += a;
            this.y += (b != null) ? b : a;
        }
        return this;
    }
    subtract(a, b) {
        if (a instanceof Vector) {
            this.x -= a.x;
            this.y -= a.y;
        }
        else {
            this.x -= a;
            this.y -= (b != null) ? b : a;
        }
        return this;
    }
    multiply(a, b) {
        if (a instanceof Vector) {
            this.x *= a.x;
            this.y *= a.y;
        }
        else {
            this.x *= a;
            this.y *= (b != null) ? b : a;
        }
        return this;
    }
    scaleTo(a, b) {
        this.normalize();
        if (b === null) {
            return this.multiply(a);
        }
        else {
            return this.multiply(a, b);
        }
    }
    set(a, b) {
        if (a instanceof Vector) {
            this.x = a.x;
            this.y = a.y;
        }
        else {
            this.x = a;
            this.y = (b != null) ? b : a;
        }
        return this;
    }
    distance(a) {
        return Math.sqrt(Math.pow((this.x - a.position.x), 2) + Math.pow((this.y - a.position.y), 2));
    }
}
exports.Vector = Vector;
//# sourceMappingURL=Vector.js.map