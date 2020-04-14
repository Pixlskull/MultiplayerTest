import { Controls, Vector, GameMap } from "./index.js";

export abstract class GameObject {
    public position: Vector;
    public radius: number
    public velocity: Vector;
    public maxVelocity: number;
    public isCollided: boolean;
    public isAlive: boolean;
    public abstract id: string;
    public abstract hp: number;
    public abstract type: string;
    public damage: number;

    constructor(position: Vector) {
        this.position = position;
        this.radius = 10;
        this.maxVelocity = 5;
        this.velocity = new Vector();
        this.isCollided = false;
        this.isAlive = true;
        this.damage = 0;
    }
    public normalizeVelocity(): void {
        const magnitude = this.velocity.magnitude
        if (magnitude !== 0) {
            this.velocity.x = this.velocity.x / magnitude;
            this.velocity.y = this.velocity.y / magnitude;
        }
    }
    public getPosition(): Vector {
        return this.position;
    }
    public setPosition(x: number, y: number): void {
        this.position.set(x, y);
    }
    public getRadius(): number {
        return this.radius;
    }
    public getVelocity(): Vector {
        return this.velocity;
    }
    public setVelocity(x: number, y: number): void {
        this.velocity.set(x, y);
    }
    public getDistance (a: GameObject): number {
        return Math.sqrt((this.position.x - a.position.x) ** 2 + (this.position.y - a.position.y) ** 2);
    }
    public collisionCheck(testObject: GameObject): boolean {
        const testPosition: Vector = testObject.getPosition();
        const testRadius: number = testObject.getRadius();
        const deltaX: number = this.position.x - testPosition.x;
        const deltaY: number = this.position.y - testPosition.y;
        const totalRadius: number = this.radius + testRadius;
        return (deltaX ** 2 + deltaY ** 2 <= totalRadius ** 2);
    }
    public getDamage(): number {
        return this.damage;
    }
    public updateStatus(): boolean {
        //Returns false if the object has 0 hp
        if (this.hp <= 0) {
            this.isAlive = false;
        }
        return this.isAlive;
    }
    abstract wallCollision(): void;
    abstract takeDamage(object: GameObject): number;
}