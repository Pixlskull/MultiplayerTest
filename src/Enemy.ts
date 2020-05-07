import { GameObject, Controls, Vector, GameMap, PlayerContainer, Weapon } from "./index.js";

export enum EnemyType {
    ZOMBIE = "zombie",
}
export abstract class Enemy extends GameObject {
    public position: Vector;
    public radius: number
    public direction: Vector;
    public maxVelocity: number;
    public damage: number;
    public abstract id: string;
    public abstract hp: number;
    public abstract type: string;
    public abstract weapon: Weapon;
    public abstract target: string;

    constructor(position: Vector) {
        super(position);
    }

    public update(players: PlayerContainer): void {
        this.ai(players);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
    }

    public wallCollision(): void{
        if (this.position.x - this.radius < 0) {
            this.direction.x = 0; 
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > GameMap.HALF_DIMENSION*2) {
            this.direction.x = 0; 
            this.position.x = GameMap.HALF_DIMENSION*2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.direction.y = 0; 
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > GameMap.HALF_DIMENSION*2) {
            this.direction.y = 0;
            this.position.y = GameMap.HALF_DIMENSION*2 - this.radius;
        }
    }
    public reloadCheck(): boolean {
        return this.weapon.reloadCheck();
    }

    public targetCheck(players: PlayerContainer): boolean {
        return (players.hasOwnProperty(this.target) && players[this.target] !== undefined);
    }

    abstract ai(players: PlayerContainer): void;
    abstract attack(players: PlayerContainer): void;
    abstract takeDamage(object: GameObject): number;
}