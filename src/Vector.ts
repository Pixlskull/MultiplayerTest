import { GameObject } from "./index.js";

export class Vector {
    public x: number;
    public y: number;

    constructor(x: any = 0, y: number = 0) {
        if (x instanceof Vector) {
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
    public normalize(): void {
        const magnitude = this.magnitude
        if (magnitude !== 0) {
            this.x = this.x / magnitude;
            this.y = this.y / magnitude;
        }
    }
    public cPerpRotation(): Vector {
        //clockwise Perpendicular rotation
        return new Vector(this.y, -this.x);
    }
    public cCPerpRotation(): Vector {
        //counterClockwise Perpendicular rotation
        return new Vector(-this.y, this.x);
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
    
    public add(a: number | Vector, b?: number): Vector {
        if (a instanceof Vector){
            this.x += a.x;
            this.y += a.y
        }
        else {
            this.x += a;
            this.y += (b != null) ? b : a;
        }

        return this;
    }

    public subtract(a: number | Vector, b?: number): Vector {
        if (a instanceof Vector){
            this.x -= a.x;
            this.y -= a.y
        }
        else {
            this.x -= a;
            this.y -= (b != null) ? b : a;
        }

        return this;
    }

    public multiply(a: number | Vector, b?: number): Vector {
        if (a instanceof Vector){
            this.x *= a.x;
            this.y *= a.y
        }
        else {
            this.x *= a;
            this.y *= (b != null) ? b : a;
        }

        return this;
    }
    public scaleTo(a: number | Vector, b?: number): Vector{
        this.normalize();
        if (b === null){
            return this.multiply(a);
        }
        else {
            return this.multiply(a,b)
        }
    }
    public set(a: number | Vector, b?: number): Vector {
        if (a instanceof Vector){
            this.x = a.x;
            this.y = a.y
        }
        else {
            this.x = a;
            this.y = (b != null) ? b : a;
        }

        return this;
    }
    
    public distance(a: GameObject): number {
        return Math.sqrt((this.x - a.position.x) ** 2 + (this.y - a.position.y) ** 2);
    }
}