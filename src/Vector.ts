import { GameObject } from "./index.js";

export class Vector {
    public x: number;
    public y: number;

    constructor(x: any = 0, y: number = 0) {
        if (x instanceof Vector){
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    get magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    public clone(): Vector {
        return new Vector(this.x, this.y);
    }
    public reset(): Vector {
        return this.set(0, 0);
    }
    public getAngle(): number {
        return Math.atan2(this.y, this.x);
    }
    public subtract(v: Vector): Vector {
        this.x -= v.x;
        this.y -= v.y;
        
        return this;
    }
    public set(x: number, y: number): Vector {
        this.x = x;
        this.y = y;
        return this;
    }
    public distance (a: GameObject): number {
        return Math.sqrt((this.x - a.position.x) ** 2 + (this.y - a.position.y) ** 2);
    }
}