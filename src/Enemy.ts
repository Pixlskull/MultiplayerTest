import { GameObject, ObjectType, Controls, Vector, GameMap, PlayerContainer, Weapon } from "./index.js";

export enum EnemyType {
    ZOMBIE = "zombie",
    SKELETON = "skeleton",
}
export interface EnemyConfig {
    id: string;
    position: number;
    hp: number;
    agroRadius: number;
    type: string;
    weapon: Weapon;
    radius?: number;
    maxVelocity?: number;
    direction?: number;
    damage?: number;
    target?: string;
    needTarget?: boolean;
}
export abstract class Enemy extends GameObject {
    //public position: Vector;
    // public radius: number
    // public direction: Vector;
    // public maxVelocity: number;
    // public damage: number;
    public abstract id: string;
    public abstract hp: number;
    public abstract agroRadius: number;
    public abstract type: string;
    public abstract weapon: Weapon;
    public target: string;
    public needTarget: boolean;

    constructor(position: Vector) {
        super(position);
        this.target = null;
        this.needTarget = true;
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

    public findTarget(objects: Array<GameObject>): void {
        
        let smallestValue: number = this.getAgroRadius();
        let currentP: string = null;
        for (let p in objects){
            if (objects[p].getObjectType() === ObjectType.PLAYER){
                let currentDist: number = this.getDistance(objects[p]);
                if (currentDist < smallestValue){
                    smallestValue = currentDist;
                    currentP = objects[p].getId();
                }
            }
        }
        if (currentP !== null) {
            this.target = currentP;
        }
    }
    public getTarget(): string{
        return this.target;
    }
    public needsTarget(): boolean{
        return this.needTarget;
    }
    public getAgroRadius(): number {
        return this.agroRadius;
    }
    public getFaction(): string {
        return this.id;
    }
    abstract ai(players: PlayerContainer): void;
    abstract attack(players: PlayerContainer): void;
    abstract takeDamage(object: GameObject): number;
}