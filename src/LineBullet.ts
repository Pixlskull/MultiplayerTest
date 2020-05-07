import { GameMap, Vector, GameObject, Player, Bullet, BulletType, Rectangle } from "./index.js";

export class LineBullet extends Bullet {
    public position: Vector;
    public direction: Vector;
    public id: string;
    public lifetime: number;
    public maxVelocity: number;
    public type: string;
    public width: number;

    constructor(position: Vector, velocity: Vector, id: string, hp: number, maxVel: number = 10, width: number = 20) {
        super(position, velocity, id, hp, maxVel);
        this.width = width;
        this.type = BulletType.LINE;
        // const rectCenterX: number = this.position.x + this.velocity.x / 2;
        // const rectCenterY: number = this.position.y + this.velocity.y / 2;
        
        // this.rect = new Rectangle(rectCenterX, rectCenterY, this.maxVelocity, this.width, true);

    }
    public get rect(): Rectangle{
        //the width of the bullet is the height of the collision rectange
        const rectCenterX: number = this.position.x + this.velocity.x / 2;
        const rectCenterY: number = this.position.y + this.velocity.y / 2;
        return new Rectangle(rectCenterX, rectCenterY, this.maxVelocity, this.width, true)
    }
    public wallCollision(): void {
        if (this.position.x - this.width/2 < 0) {
            this.direction.x = -this.direction.x;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.width/2 > GameMap.HALF_DIMENSION * 2) {
            this.direction.x = -this.direction.x;
            this.position.x = GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.width/2 < 0) {
            this.direction.y = -this.direction.y;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.width/2 > GameMap.HALF_DIMENSION * 2) {
            this.direction.y = -this.direction.y;
            this.position.y = GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    public collisionCheck(object: GameObject): boolean {
        const rectAngle: number = Math.atan2(this.direction.y, this.direction.x);
        const rectCenterX: number = this.rect.centerX;
        const rectCenterY: number = this.rect.centerY;
        //console.log("Rect Center Position: ", rectCenterX, rectCenterY, rectAngle);
        //console.log("Object Position: ", object.position.x, object.position.y);
        const unrotatedCircleX: number = Math.cos(rectAngle) * (object.position.x - rectCenterX) -
            Math.sin(rectAngle) * (object.position.y - rectCenterY) + rectCenterX;
        const unrotatedCircleY: number = Math.sin(rectAngle) * (object.position.x - rectCenterX) +
            Math.cos(rectAngle) * (object.position.y - rectCenterY) + rectCenterY;
        //console.log("current position: " + this.position.x + " " + this.position.y);
        return this.rectCircleCollision(unrotatedCircleX, unrotatedCircleY, object.getRadius());
    }
    public rectCircleCollision(uCX: number, uCY: number, radius: number): boolean {
        //ahhhhhh i don't want to make a circle class, so here i am
        //http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/
        //console.log("rotated coords ", uCX, uCY)
        let closestX, closestY: number;
        const rect: Rectangle = this.rect;
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
        const distance: number = Math.sqrt((uCX - closestX) ** 2 + (uCY - closestY) ** 2);
        //console.log("closest point : " + closestX + " " + closestY);
        //console.log("distance ", distance);
        if (distance < radius){
            return true;
        }
        return false;
    }
}