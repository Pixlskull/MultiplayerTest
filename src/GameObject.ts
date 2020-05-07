import { Controls, Vector, GameMap } from "./index.js";

export abstract class GameObject {
    public position: Vector;
    public radius: number
    public direction: Vector;
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
        this.direction = new Vector();
        this.isCollided = false;
        this.isAlive = true;
        this.damage = 0;
    }
    public get velocity(): Vector {
        return this.direction.clone().multiply(this.maxVelocity);
    }
    public getPosition(): Vector {
        return this.position;
    }
    public setPosition(x: number, y: number): void {
        this.position.set(x, y);
    }
    public getDirection(): Vector {
        return this.direction;
    }

    public setDirection(a: number | Vector, b?: number): Vector{
        if (a instanceof Vector || b === null){
            this.direction.set(a)
        }
        else{
            this.direction.set(a, b)
        }

        this.normalizeDirection();
        return this.direction;
    }

    public normalizeDirection(): void{
        this.direction.normalize();
    }

    public getRadius(): number {
        return this.radius;
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
    public wallCollision(): void{
        //Default behavior is to have objects "bounce" off walls
        if (this.position.x - this.radius < 0) {
            this.direction.x = -this.direction.x; 
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > GameMap.HALF_DIMENSION*2) {
            this.direction.x = -this.direction.x; 
            this.position.x = GameMap.HALF_DIMENSION*2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.direction.y = -this.direction.y; 
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > GameMap.HALF_DIMENSION*2) {
            this.direction.y = -this.direction.y;
            this.position.y = GameMap.HALF_DIMENSION*2 - this.radius;
        }
    }
    abstract takeDamage(object: GameObject): number;
}