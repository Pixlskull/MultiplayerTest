"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Skeleton extends index_js_1.Enemy {
    constructor(position, id) {
        super(position);
        this.radius = 15;
        this.maxVelocity = 3;
        this.hp = 5;
        this.damage = 0;
        this.agroRadius = 500;
        this.firingRange = 200;
        this.type = index_js_1.EnemyType.SKELETON;
        this.id = id;
        this.weapon = new index_js_1.Gun(this.id, 1, 1000, 5);
    }
    reloadCheck() {
        return this.weapon.reloadCheck();
    }
    ai(players) {
        //returns true if Zombie has a target
        let target = players[this.getTarget()];
        if (players.hasOwnProperty(this.getTarget()) && target !== undefined) {
            if (this.getDistance(target) > 200) {
                this.direction = new index_js_1.Vector(target.position.x - this.position.x, target.position.y - this.position.y);
                this.normalizeDirection();
            }
            else {
                this.direction = new index_js_1.Vector(0, 0);
            }
        }
        else {
            //idk
        }
    }
    attack(players) {
        let targetVec = players[this.getTarget()].position.clone();
        return this.weapon.fireWeapon(this.position.clone(), targetVec.subtract(this.position));
    }
    takeDamage(object) {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}
exports.Skeleton = Skeleton;
//# sourceMappingURL=Skeleton.js.map