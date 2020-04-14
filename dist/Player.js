"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Player extends index_js_1.GameObject {
    constructor(position, id) {
        super(position);
        this.id = id;
        this.connected = true;
        this.maxVelocity = 5;
        this.radius = 15;
        this.hp = 10;
        this.hpMax = this.hp;
        //todo: enum
        this.type = "player";
        this.weapon = new index_js_1.Sniper(id);
    }
    update() {
        this.position.x += this.velocity.x * this.maxVelocity;
        this.position.y += this.velocity.y * this.maxVelocity;
        this.wallCollision();
    }
    updateMovement(controls) {
        const maxVelocity = this.maxVelocity;
        this.velocity.reset();
        if (controls.left === true) {
            this.velocity.x -= maxVelocity;
        }
        if (controls.right === true) {
            this.velocity.x += maxVelocity;
        }
        if (controls.up === true) {
            this.velocity.y -= maxVelocity;
        }
        if (controls.down === true) {
            this.velocity.y += maxVelocity;
        }
        this.normalizeVelocity();
    }
    wallCollision() {
        if (this.position.x - this.radius < 0) {
            this.velocity.x = 0;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.velocity.x = 0;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.velocity.y = 0;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.velocity.y = 0;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    disconnect() {
        this.connected = false;
    }
    reloadCheck() {
        return this.weapon.reloadCheck();
    }
    fireWeapon(controls) {
        return this.weapon.fireWeapon(this.position.clone(), controls.mousePosition);
    }
    takeDamage(object) {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map