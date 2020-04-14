"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
var EnemyType;
(function (EnemyType) {
    EnemyType["ZOMBIE"] = "zombie";
})(EnemyType = exports.EnemyType || (exports.EnemyType = {}));
class Enemy extends index_js_1.GameObject {
    constructor(position) {
        super(position);
    }
    update(players) {
        this.ai(players);
        this.position.x += this.velocity.x * this.maxVelocity;
        this.position.y += this.velocity.y * this.maxVelocity;
        this.wallCollision();
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
    reloadCheck() {
        return this.weapon.reloadCheck();
    }
    targetCheck(players) {
        return (players.hasOwnProperty(this.target) && players[this.target] !== undefined);
    }
}
exports.Enemy = Enemy;
//# sourceMappingURL=Enemy.js.map