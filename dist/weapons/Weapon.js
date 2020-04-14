"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WeaponType;
(function (WeaponType) {
    WeaponType["SNIPER"] = "sniper";
    WeaponType["SWORD"] = "sword";
})(WeaponType = exports.WeaponType || (exports.WeaponType = {}));
class Weapon {
    constructor(owner) {
        this.owner = owner;
    }
    reloadCheck() {
        const currentTime = new Date();
        if (currentTime.getTime() - this.lastFiredNumber() >= this.cooldown) {
            return true;
        }
        return false;
    }
    lastFiredNumber() {
        return this.lastFired.getTime();
    }
    getBulletCount() {
        return this.bulletCount;
    }
}
exports.Weapon = Weapon;
//# sourceMappingURL=Weapon.js.map