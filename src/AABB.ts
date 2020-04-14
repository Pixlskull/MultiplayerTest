import { GameObject, Vector } from "./index.js"

export class AABB{
    x: number;
    y: number;
    halfLength: number;
    constructor(x: number, y: number, halfLength: number){
        this.x = x;
        this.y = y;
        this.halfLength = halfLength;
    }
    public containsObject(point: GameObject): boolean{
        const position: Vector = point.getPosition();
        const r = point.getRadius();
        return ((position.x + r >= this.x - this.halfLength) &&
            (position.x - r <= this.x + this.halfLength) &&
            (position.y + r >= this.y - this.halfLength) &&
            (position.y -r <= this.y + this.halfLength))
    }

    public intersectsAABB(aabb: AABB){
        return ((Math.abs(this.x - aabb.x) < this.halfLength + aabb.halfLength) &&
            (Math.abs(this.y - aabb.y) < this.halfLength + aabb.halfLength))
    }
}