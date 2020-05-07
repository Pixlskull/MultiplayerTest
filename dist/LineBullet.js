"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class LineBullet extends index_js_1.Bullet {
    constructor(position, velocity, id, hp, maxVel = 10, width = 20) {
        super(position, velocity, id, hp, maxVel);
        this.width = width;
        this.type = index_js_1.BulletType.LINE;
        // const rectCenterX: number = this.position.x + this.velocity.x / 2;
        // const rectCenterY: number = this.position.y + this.velocity.y / 2;
        // this.rect = new Rectangle(rectCenterX, rectCenterY, this.maxVelocity, this.width, true);
    }
    get rect() {
        //the width of the bullet is the height of the collision rectange
        const rectCenterX = this.position.x + this.velocity.x / 2;
        const rectCenterY = this.position.y + this.velocity.y / 2;
        return new index_js_1.Rectangle(rectCenterX, rectCenterY, this.maxVelocity, this.width, true);
    }
    wallCollision() {
        if (this.position.x - this.width / 2 < 0) {
            this.direction.x = -this.direction.x;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.width / 2 > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.x = -this.direction.x;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.width / 2 < 0) {
            this.direction.y = -this.direction.y;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.width / 2 > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.y = -this.direction.y;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    collisionCheck(object) {
        const rectAngle = Math.atan2(this.direction.y, this.direction.x);
        const rectCenterX = this.rect.centerX;
        const rectCenterY = this.rect.centerY;
        //console.log("Rect Center Position: ", rectCenterX, rectCenterY, rectAngle);
        //console.log("Object Position: ", object.position.x, object.position.y);
        const unrotatedCircleX = Math.cos(rectAngle) * (object.position.x - rectCenterX) -
            Math.sin(rectAngle) * (object.position.y - rectCenterY) + rectCenterX;
        const unrotatedCircleY = Math.sin(rectAngle) * (object.position.x - rectCenterX) +
            Math.cos(rectAngle) * (object.position.y - rectCenterY) + rectCenterY;
        //console.log("current position: " + this.position.x + " " + this.position.y);
        return this.rectCircleCollision(unrotatedCircleX, unrotatedCircleY, object.getRadius());
    }
    rectCircleCollision(uCX, uCY, radius) {
        //ahhhhhh i don't want to make a circle class, so here i am
        //http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/
        //console.log("rotated coords ", uCX, uCY)
        let closestX, closestY;
        const rect = this.rect;
        if (uCX < rect.x) {
            closestX = rect.x;
        }
        else if (uCX > rect.x + rect.width) {
            closestX = rect.x + rect.width;
        }
        else {
            closestX = uCX;
        }
        if (uCY < rect.y) {
            closestY = rect.y;
        }
        else if (uCY > rect.y + rect.height) {
            closestY = rect.y + rect.height;
        }
        else {
            closestY = uCY;
        }
        const distance = Math.sqrt(Math.pow((uCX - closestX), 2) + Math.pow((uCY - closestY), 2));
        //console.log("closest point : " + closestX + " " + closestY);
        //console.log("distance ", distance);
        if (distance < radius) {
            return true;
        }
        return false;
    }
}
exports.LineBullet = LineBullet;
//# sourceMappingURL=LineBullet.js.map