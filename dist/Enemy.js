"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
var EnemyType;
(function (EnemyType) {
    EnemyType["ZOMBIE"] = "zombie";
    EnemyType["SKELETON"] = "skeleton";
})(EnemyType = exports.EnemyType || (exports.EnemyType = {}));
class Enemy extends index_js_1.GameObject {
    constructor(position) {
        super(position);
        this.target = null;
        this.needTarget = true;
    }
    update(players) {
        this.ai(players);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
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
    reloadCheck() {
        return this.weapon.reloadCheck();
    }
    targetCheck(players) {
        return (players.hasOwnProperty(this.target) && players[this.target] !== undefined);
    }
    findTarget(objects) {
        let smallestValue = this.getAgroRadius();
        let currentP = null;
        for (let p in objects) {
            if (objects[p].getObjectType() === index_js_1.ObjectType.PLAYER) {
                let currentDist = this.getDistance(objects[p]);
                if (currentDist < smallestValue) {
                    smallestValue = currentDist;
                    currentP = objects[p].getId();
                }
            }
        }
        if (currentP !== null) {
            this.target = currentP;
        }
    }
    getTarget() {
        return this.target;
    }
    needsTarget() {
        return this.needTarget;
    }
    getAgroRadius() {
        return this.agroRadius;
    }
    getFaction() {
        return this.id;
    }
}
exports.Enemy = Enemy;
//# sourceMappingURL=Enemy.js.map