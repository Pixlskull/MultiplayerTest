"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class FastBullet extends index_js_1.Bullet {
    constructor(position, velocity, id, bulletCount, maxVel = 50) {
        super(position, velocity, id, bulletCount);
        this.radius = 2;
        this.maxVelocity = maxVel;
        this.type = "fastbullet";
    }
    wallCollision() {
        if (this.position.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.velocity.x = -this.velocity.x;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.velocity.y = -this.velocity.y;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    collisionCheck(object) {
        const endX = this.position.x + this.velocity.x * this.maxVelocity;
        const endY = this.position.y + this.velocity.y * this.maxVelocity;
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