import { GameMap, Vector, GameObject, Player, Bullet, BulletType } from "./index.js";

export class FastBullet extends Bullet{
    public position: Vector;
    public direction: Vector;
    public id: string;
    public lifetime: number;
    public maxVelocity: number;
    public radius: number;
    public type: string;

    constructor(position: Vector, velocity: Vector, id: string, ownerId: string, hp: number, maxVel: number = 50){
        super(position, velocity, id, ownerId, hp, maxVel);
        this.radius = 2;
        this.type = BulletType.FAST;
    }
    
    public collisionCheck(object: GameObject): boolean{
        const endX = this.position.x + this.velocity.x;
        const endY = this.position.y + this.velocity.y;
        const endPos = new Vector(endX, endY);
        return this.pointLineDistanceSquared(this.position, endPos, object.getPosition()) < object.getRadius()**2;
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