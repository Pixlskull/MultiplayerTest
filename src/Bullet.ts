import { GameMap, Vector, GameObject, Player } from "./index.js";

export class Bullet extends GameObject{
    public velocity: Vector;
    public id: string;
    public lifetime: number;
    public type: string;
    public hp: number;
    public firstTick: boolean;

    constructor(position: Vector, velocity: Vector, id: string, hp: number = 1, maxVel: number = 10){
        super(position);
        this.id = id;
        this.velocity = velocity;
        this.maxVelocity = maxVel;
        this.normalizeVelocity();
        this.hp = hp;
        this.lifetime = 1000;
        this.type = "bullet";
        this.damage = 1;
        this.firstTick = true;
    }
    public update(): void {
        if (this.firstTick){
            this.firstTick = false;
            return;
        }
        this.position.x += this.velocity.x * this.maxVelocity;
        this.position.y += this.velocity.y * this.maxVelocity;
        this.wallCollision();
    }
    public factionCheck(object: GameObject): boolean {
        return !(this.id === object.id)
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

    public takeDamage(object: GameObject): number {
        this.hp -= (object.getDamage() + 1);
        this.updateStatus();
        return this.hp;
    }
}