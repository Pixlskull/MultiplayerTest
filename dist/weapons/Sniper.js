"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const uuid_1 = require("uuid");
class Sniper extends index_js_1.Weapon {
    constructor(owner, damage = 1, cooldown = 2000, bulletVelocity = 30) {
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = bulletVelocity;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
    }
    fireWeapon(selfPos, targetDir) {
        const bullets = {};
        const id = uuid_1.v4();
        this.bulletCount += 1;
        this.lastFired = new Date();
        bullets[id] = new index_js_1.FastBullet(selfPos, targetDir, this.owner, 1, this.bulletVelocity);
        return bullets;
    }
}
exports.Sniper = Sniper;
//# sourceMappingURL=Sniper.js.map