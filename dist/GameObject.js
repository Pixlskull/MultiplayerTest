"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
var ObjectType;
(function (ObjectType) {
    ObjectType["BULLET"] = "bullet";
    ObjectType["LINEBULLET"] = "lineBullet";
    ObjectType["FASTBULLET"] = "fastBullet";
    ObjectType["PLAYER"] = "player";
    ObjectType["ZOMBIE"] = "zombie";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));
class GameObject {
    constructor(position) {
        this.position = position;
        this.radius = 10;
        this.maxVelocity = 5;
        this.direction = new index_js_1.Vector();
        this.isCollided = false;
        this.isAlive = true;
        this.damage = 0;
    }
    get velocity() {
        return this.direction.clone().multiply(this.maxVelocity);
    }
    getObjectType() {
        return this.objectType;
    }
    getPosition() {
        return this.position;
    }
    setPosition(x, y) {
        this.position.set(x, y);
    }
    getDirection() {
        return this.direction;
    }
    setDirection(a, b) {
        if (a instanceof index_js_1.Vector || b === null) {
            this.direction.set(a);
        }
        else {
            this.direction.set(a, b);
        }
        this.normalizeDirection();
        return this.direction;
    }
    normalizeDirection() {
        this.direction.normalize();
    }
    getRadius() {
        return this.radius;
    }
    getMaxVelocity() {
        return this.maxVelocity;
    }
    getIsAlive() {
        return this.isAlive;
    }
    setIsAlive(state) {
        this.isAlive = state;
    }
    getIsCollided() {
        return this.isCollided;
    }
    getId() {
        return this.id;
    }
    getHp() {
        return this.hp;
    }
    getDamage() {
        return this.damage;
    }
    getDistance(a) {
        return Math.sqrt(Math.pow((this.position.x - a.position.x), 2) + Math.pow((this.position.y - a.position.y), 2));
    }
    collisionCheck(testObject) {
        const testPosition = testObject.getPosition();
        const testRadius = testObject.getRadius();
        const deltaX = this.position.x - testPosition.x;
        const deltaY = this.position.y - testPosition.y;
        const totalRadius = this.radius + testRadius;
        return (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) <= Math.pow(totalRadius, 2));
    }
    updateStatus() {
        //Returns false if the object has 0 hp
        if (this.hp <= 0) {
            this.isAlive = false;
        }
        return this.isAlive;
    }
    wallCollision() {
        //Default behavior is to have objects "bounce" off walls
        if (this.position.x - this.radius < 0) {
            this.direction.x = -this.direction.x;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.x = -this.direction.x;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.direction.y = -this.direction.y;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.y = -this.direction.y;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
}
exports.GameObject = GameObject;
//# sourceMappingURL=GameObject.js.map