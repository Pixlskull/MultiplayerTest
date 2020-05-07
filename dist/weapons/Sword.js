"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const uuid_1 = require("uuid");
class Sword extends index_js_1.Weapon {
    constructor(owner, damage = 2, cooldown = 250, velocity = 30) {
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = 30;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
        this.rightSide = true;
    }
    fireWeapon(selfPos, targetDir) {
        //targetDir is a non-unit vector that is the aim relative to the user
        //targetPos is that coordinate but in absolute units, not relative to the user
        //shiftedPos is offset from the user, makes shots come in slightly from the side
        //modfiedTargetDir is non-unit aim relative to the bullet
        const bullets = {};
        const id = uuid_1.v4();
        const targetPos = selfPos.clone().add(targetDir);
        this.bulletCount += 1;
        this.lastFired = new Date();
        const shiftedPos = this.rightSide ? selfPos.add(targetDir.cPerpRotation().scaleTo(50))
            : selfPos.add(targetDir.cCPerpRotation().scaleTo(50));
        let modifiedTargetDir = targetPos.clone().subtract(shiftedPos);
        bullets[id] = new index_js_1.LineBullet(shiftedPos, modifiedTargetDir, this.owner, 1, 10, 30);
        this.rightSide = !this.rightSide;
        return bullets;
    }
}
exports.Sword = Sword;
//# sourceMappingURL=Sword.js.map