import { GameMap, Vector, GameObject, Player } from "./index.js";

export enum BulletType {
    FAST = "fast",
    LINE = "line",
    NORMAL = "bullet"
}

export class Bullet extends GameObject{
    //public direction: Vector;
    public id: string;
    public ownerId: string;
    public lifetime: number;
    public type: string;
    public hp: number;
    public firstTick: boolean;
    public birthTime: Date;

    constructor(position: Vector, direction: Vector, id: string, ownerId: string, hp: number = 1, maxVel: number = 10){
        super(position);
        this.id = id;
        this.ownerId = ownerId;
        this.direction = direction;
        this.maxVelocity = maxVel;
        this.normalizeDirection();
        this.hp = hp;
        this.lifetime = 400000;
        this.type = "bullet";
        this.damage = 1;
        this.firstTick = true;
        this.birthTime = new Date();
    }
    public update(): void {
        if (this.firstTick){
            this.firstTick = false;
            return;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
        this.lifetimeCheck();
    }
    public getBirthTimeNumber(): number {
        return this.birthTime.getTime();
    }
    public lifetimeCheck(): void {
        const currentTime: Date = new Date();
        if (currentTime.getTime() - this.getBirthTimeNumber() >= this.lifetime) {
            this.setIsAlive(false);
        }
    }
    public getFaction(): string {
        return this.ownerId;
    }
    public factionCheck(object: GameObject): boolean {
        return !(this.ownerId === object.getFaction())
    }

    public takeDamage(object: GameObject): number {
        this.hp -= (object.getDamage() + 1);
        this.updateStatus();
        return this.hp;
    }
}