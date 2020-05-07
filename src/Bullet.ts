import { GameMap, Vector, GameObject, Player } from "./index.js";

export enum BulletType {
    FAST = "fast",
    LINE = "line",
    NORMAL = "bullet"
}

export class Bullet extends GameObject{
    public direction: Vector;
    public id: string;
    public lifetime: number;
    public type: string;
    public hp: number;
    public firstTick: boolean;

    constructor(position: Vector, direction: Vector, id: string, hp: number = 1, maxVel: number = 10){
        super(position);
        this.id = id;
        this.direction = direction;
        this.maxVelocity = maxVel;
        this.normalizeDirection();
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
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
    }
    public factionCheck(object: GameObject): boolean {
        return !(this.id === object.id)
    }

    public takeDamage(object: GameObject): number {
        this.hp -= (object.getDamage() + 1);
        this.updateStatus();
        return this.hp;
    }
}