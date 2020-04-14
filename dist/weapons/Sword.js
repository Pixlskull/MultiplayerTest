"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const uuid_1 = require("uuid");
class Sword extends index_js_1.Weapon {
    constructor(owner, damage = 2, cooldown = 500, velocity = 30) {
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = 30;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
    }
    fireWeapon(selfPos, targetPos) {
        const bullets = {};
        const id = uuid_1.v4();
        this.bulletCount += 1;
        this.lastFired = new Date();
        bullets[id] = new index_js_1.FastBullet(selfPos, new index_js_1.Vector(targetPos.x, targetPos.y), this.owner, 1);
        return bullets;
    }
}
exports.Sword = Sword;
//# sourceMappingURL=Sword.js.map