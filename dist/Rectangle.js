"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rectangle {
    constructor(x, y, width, height, fromCenter = false) {
        if (fromCenter) {
            this.centerX = x;
            this.centerY = y;
            this.x = x - width / 2;
            this.y = y - height / 2;
            this.width = width;
            this.height = height;
        }
        else {
            this.x = x;
            this.y = y;
            this.centerX = x + width / 2;
            this.centerY = y + width / 2;
            this.width = width;
            this.height = height;
        }
    }
    containsObject(point) {
        const position = point.getPosition();
        const r = point.getRadius();
        return ((position.x + r >= this.x - this.width / 2) &&
            (position.x - r <= this.x + this.width / 2) &&
            (position.y + r >= this.y - this.height / 2) &&
            (position.y - r <= this.y + this.height / 2));
    }
    intersectsRectangle(rect) {
        return ((Math.abs(this.x - rect.x) < this.width / 2 + rect.width / 2) &&
            (Math.abs(this.y - rect.y) < this.height / 2 + rect.height / 2));
    }
    getDistance(a) {
        return Math.sqrt(Math.pow((this.x - a.x), 2) + Math.pow((this.y - a.y), 2));
    }
}
exports.Rectangle = Rectangle;
//# sourceMappingURL=Rectangle.js.map