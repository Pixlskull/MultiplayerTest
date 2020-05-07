"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class FastBullet extends index_js_1.Bullet {
    constructor(position, velocity, id, hp, maxVel = 50) {
        super(position, velocity, id, hp, maxVel);
        this.radius = 2;
        this.type = index_js_1.BulletType.FAST;
    }
    collisionCheck(object) {
        const endX = this.position.x + this.velocity.x;
        const endY = this.position.y + this.velocity.y;
        const endPos = new index_js_1.Vector(endX, endY);
        return this.pointLineDistanceSquared(this.position, endPos, object.position) < Math.pow(object.getRadius(), 2);
    }
    pointLineDistanceSquared(p1, p2, o1) {
        //https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        const deltaX = p2.x - p1.x;
        const deltaY = p2.y - p1.y;
        const lineLengthSquared = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
        //Finds the place on line closest to the point
        let t = ((o1.x - p1.x) * deltaX + (o1.y - p1.y) * deltaY) / lineLengthSquared;
        t = Math.max(0, Math.min(1, t));
        return (Math.pow((o1.x - (p1.x + t * deltaX)), 2) + Math.pow((o1.y - (p1.y + t * deltaY)), 2));
    }
}
exports.FastBullet = FastBullet;
//# sourceMappingURL=FastBullet.js.map