"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
var BulletType;
(function (BulletType) {
    BulletType["FAST"] = "fast";
    BulletType["LINE"] = "line";
    BulletType["NORMAL"] = "bullet";
})(BulletType = exports.BulletType || (exports.BulletType = {}));
class Bullet extends index_js_1.GameObject {
    constructor(position, direction, id, hp = 1, maxVel = 10) {
        super(position);
        this.id = id;
        this.direction = direction;
        this.maxVelocity = maxVel;
        this.normalizeDirection();
        this.hp = hp;
        this.lifetime = 1000;
        this.type = "bullet";
        this.damage = 1;
        this.firstTick = true;
    }
    update() {
        if (this.firstTick) {
            this.firstTick = false;
            return;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
    }
    factionCheck(object) {
        return !(this.id === object.id);
    }
    takeDamage(object) {
        this.hp -= (object.getDamage() + 1);
        this.updateStatus();
        return this.hp;
    }
}
exports.Bullet = Bullet;
//# sourceMappingURL=Bullet.js.map