"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const uuid_1 = require("uuid");
class Gun extends index_js_1.Weapon {
    constructor(owner, damage = 1, cooldown = 500, bulletVelocity = 10) {
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = bulletVelocity;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
    }
    fireWeapon(selfPos, targetPos) {
        const bullets = {};
        const id = uuid_1.v4();
        this.bulletCount += 1;
        this.lastFired = new Date();
        bullets[id] = new index_js_1.Bullet(selfPos, new index_js_1.Vector(targetPos.x, targetPos.y), id, this.owner, 1, this.bulletVelocity);
        return bullets;
    }
}
exports.Gun = Gun;
//# sourceMappingURL=Gun.js.map