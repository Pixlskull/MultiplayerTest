"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Zombie extends index_js_1.Enemy {
    constructor(position, id) {
        super(position);
        console.log(this.position);
        this.radius = 10;
        this.maxVelocity = 3;
        this.hp = 10;
        this.type = index_js_1.EnemyType.ZOMBIE;
        this.id = id;
        this.weapon = new index_js_1.Sniper(this.id, 1, 1000, 5);
        this.target = null;
    }
    reloadCheck() {
        return this.weapon.reloadCheck();
    }
    ai(players) {
        if (players.hasOwnProperty(this.target)) {
            let target = players[this.target];
            if (players[this.target] !== undefined) {
                this.velocity = new index_js_1.Vector(target.position.x - this.position.x, target.position.y - this.position.y);
                this.normalizeVelocity();
            }
            //I don't feel like typing out players[this.target];
            else {
                this.findTarget(players);
            }
        }
        else {
            this.findTarget(players);
        }
    }
    targetCheck(players) {
        return (players.hasOwnProperty(this.target) && players[this.target] !== undefined);
    }
    findTarget(players) {
        let smallestValue = Number.POSITIVE_INFINITY;
        let currentP = null;
        for (let p in players) {
            if (this.getDistance(players[p]) < smallestValue) {
                currentP = p;
            }
        }
        if (currentP !== null) {
            this.target = currentP;
        }
    }
    attack(players) {
        let targetVec = players[this.target].position.clone();
        return this.weapon.fireWeapon(this.position.clone(), targetVec.subtract(this.position));
    }
    takeDamage(object) {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}
exports.Zombie = Zombie;
//# sourceMappingURL=Zombie.js.map