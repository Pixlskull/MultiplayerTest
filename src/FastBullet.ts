import { GameMap, Vector, GameObject, Player, Bullet } from "./index.js";

export class FastBullet extends Bullet{
    public position: Vector;
    public velocity: Vector;
    public id: string;
    public bulletCount: number;
    public lifetime: number;
    public maxVelocity: number;
    public radius: number;
    public type: string;

    constructor(position: Vector, velocity: Vector, id: string, bulletCount: number, maxVel: number = 50){
        super(position, velocity, id, bulletCount);
        this.radius = 2;
        this.maxVelocity = maxVel;
        this.type = "fastbullet";
    }
    public wallCollision(): void{
        if (this.position.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x; 
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > GameMap.HALF_DIMENSION*2) {
            this.velocity.x = -this.velocity.x; 
            this.position.x = GameMap.HALF_DIMENSION*2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y; 
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > GameMap.HALF_DIMENSION*2) {
            this.velocity.y = -this.velocity.y;
            this.position.y = GameMap.HALF_DIMENSION*2 - this.radius;
        }
    }
    public collisionCheck(object: GameObject): boolean{
        const endX = this.position.x + this.velocity.x * this.maxVelocity;
        const endY = this.position.y + this.velocity.y * this.maxVelocity;
        const endPos = new Vector(endX, endY);
        return this.pointLineDistanceSquared(this.position, endPos, object.position) < object.getRadius()**2;
    }
    public pointLineDistanceSquared(p1: Vector, p2: Vector, o1: Vector): number{
        //https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        const deltaX = p2.x - p1.x;
        const deltaY = p2.y - p1.y;
        const lineLengthSquared = deltaX**2 + deltaY**2;
        //Finds the place on line closest to the point
        let t = ((o1.x - p1.x) * deltaX + (o1.y - p1.y) * deltaY) / lineLengthSquared;
        t = Math.max(0, Math.min(1, t));
        return ((o1.x - (p1.x + t * deltaX))**2 + (o1.y - (p1.y + t * deltaY))**2)
    }
}