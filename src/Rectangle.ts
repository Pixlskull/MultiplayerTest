import { GameObject, Vector } from "./index.js"

export class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    constructor(x: number, y: number, width: number, height: number, fromCenter: boolean = false){
        if (fromCenter){
            this.centerX = x;
            this.centerY = y;
            this.x = x - width/2;
            this.y = y - height/2;
            this.width = width;
            this.height = height;
        }
        else {
            this.x = x;
            this.y = y;
            this.centerX = x + width/2;
            this.centerY = y + width/2;
            this.width = width;
            this.height = height;
        }
        
    }

    public containsObject(point: GameObject): boolean{
        const position: Vector = point.getPosition();
        const r = point.getRadius();
        return ((position.x + r >= this.x - this.width/2) &&
            (position.x - r <= this.x + this.width/2) &&
            (position.y + r >= this.y - this.height/2) &&
            (position.y -r <= this.y + this.height/2))
    }

    public intersectsRectangle(rect: Rectangle): boolean{
        return ((Math.abs(this.x - rect.x) < this.width/2 + rect.width/2) &&
            (Math.abs(this.y - rect.y) < this.height/2 + rect.height/2))
    }

    public getDistance(a: Vector): number {
        return Math.sqrt((this.x - a.x) ** 2 + (this.y - a.y) ** 2);
    }
}