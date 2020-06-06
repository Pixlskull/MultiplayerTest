"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Zombie extends index_js_1.Enemy {
    constructor(position, id) {
        super(position);
        this.radius = 15;
        this.maxVelocity = 3;
        this.hp = 5;
        this.damage = 0;
        this.agroRadius = 300;
        this.type = index_js_1.EnemyType.ZOMBIE;
        this.id = id;
        this.weapon = new index_js_1.Gun(this.id, 1, 1000, 5);
    }
    ai(players) {
        //returns true if Zombie has a target
        const target = players[this.getTarget()];
        if (players.hasOwnProperty(this.getTarget()) && target !== undefined) {
            const targetPos = target.getPosition();
            this.direction = new index_js_1.Vector(targetPos.x - this.position.x, targetPos.y - this.position.y);
            this.normalizeDirection();
        }
        else {
            //idk
        }
    }
    attack(players) {
        const targetVec = players[this.getTarget()].position.clone();
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