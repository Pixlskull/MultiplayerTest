"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AABB {
    constructor(x, y, halfLength) {
        this.x = x;
        this.y = y;
        this.halfLength = halfLength;
    }
    containsObject(point) {
        const position = point.getPosition();
        const r = point.getRadius();
        return ((position.x + r >= this.x - this.halfLength) &&
            (position.x - r <= this.x + this.halfLength) &&
            (position.y + r >= this.y - this.halfLength) &&
            (position.y - r <= this.y + this.halfLength));
    }
    intersectsAABB(aabb) {
        return ((Math.abs(this.x - aabb.x) < this.halfLength + aabb.halfLength) &&
            (Math.abs(this.y - aabb.y) < this.halfLength + aabb.halfLength));
    }
}
exports.AABB = AABB;
//# sourceMappingURL=AABB.js.map