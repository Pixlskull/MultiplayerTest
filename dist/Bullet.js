"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Bullet extends index_js_1.GameObject {
    constructor(position, velocity, id, hp = 1) {
        super(position);
        this.id = id;
        this.velocity = velocity;
        this.maxVelocity = 10;
        this.normalizeVelocity();
        this.hp = hp;
        this.lifetime = 1000;
        this.type = "bullet";
        this.damage = 1;
    }
    update() {
        this.position.x += this.velocity.x * this.maxVelocity;
        this.position.y += this.velocity.y * this.maxVelocity;
        this.wallCollision();
    }
    factionCheck(object) {
        return !(this.id === object.id);
    }
    wallCollision() {
        if (this.position.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.velocity.x = -this.velocity.x;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.velocity.y = -this.velocity.y;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    takeDamage(object) {
        this.hp -= (object.getDamage() + 1);
        this.updateStatus();
        return this.hp;
    }
}
exports.Bullet = Bullet;
//# sourceMappingURL=Bullet.js.map