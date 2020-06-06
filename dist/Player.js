"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Player extends index_js_1.GameObject {
    //public position: Vector;
    //public objectType: string;
    constructor(position, id) {
        super(position);
        this.id = id;
        this.connected = true;
        this.maxVelocity = 5;
        this.radius = 15;
        this.hp = 100;
        this.exp = 0;
        this.level = 1;
        this.hpMax = this.hp;
        //todo: enum
        this.type = "player";
        this.objectType = index_js_1.ObjectType.PLAYER;
        this.weapon = new index_js_1.Gun(id);
        //this.weapon = new Sword(id);
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
    }
    updateMovement(controls) {
        this.direction.reset();
        if (controls.left === true) {
            this.direction.x -= 1;
        }
        if (controls.right === true) {
            this.direction.x += 1;
        }
        if (controls.up === true) {
            this.direction.y -= 1;
        }
        if (controls.down === true) {
            this.direction.y += 1;
        }
        this.normalizeDirection();
    }
    wallCollision() {
        if (this.position.x - this.radius < 0) {
            this.direction.x = 0;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.x = 0;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.direction.y = 0;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.y = 0;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    getConnected() {
        return this.connected;
    }
    disconnect() {
        this.connected = false;
    }
    getFaction() {
        return this.id;
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