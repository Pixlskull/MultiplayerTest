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
    clone() {
        return new Vector(this.x, this.y);
    }
    reset() {
        return this.set(0, 0);
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    distance(a) {
        return Math.sqrt(Math.pow((this.x - a.position.x), 2) + Math.pow((this.y - a.position.y), 2));
    }
}
exports.Vector = Vector;
//# sourceMappingURL=Vector.js.map