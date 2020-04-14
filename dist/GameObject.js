"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class GameObject {
    constructor(position) {
        this.position = position;
        this.radius = 10;
        this.maxVelocity = 5;
        this.velocity = new index_js_1.Vector();
        this.isCollided = false;
        this.isAlive = true;
        this.damage = 0;
    }
    normalizeVelocity() {
        const magnitude = this.velocity.magnitude;
        if (magnitude !== 0) {
            this.velocity.x = this.velocity.x / magnitude;
            this.velocity.y = this.velocity.y / magnitude;
        }
    }
    getPosition() {
        return this.position;
    }
    setPosition(x, y) {
        this.position.set(x, y);
    }
    getRadius() {
        return this.radius;
    }
    getVelocity() {
        return this.velocity;
    }
    setVelocity(x, y) {
        this.velocity.set(x, y);
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
    getDamage() {
        return this.damage;
    }
    updateStatus() {
        //Returns false if the object has 0 hp
        if (this.hp <= 0) {
            this.isAlive = false;
        }
        return this.isAlive;
    }
}
exports.GameObject = GameObject;
//# sourceMappingURL=GameObject.js.map