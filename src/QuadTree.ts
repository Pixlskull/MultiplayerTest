import { GameObject, Vector, AABB } from "./index.js"

export class QuadTree{
    //https://medium.com/mytake/collision-detection-using-quad-tree-data-structure-ff7f6e8b819
    static size: number = 3;
    public boundaryAABB: AABB;
    public halfLength: number;
    public gameObjects: Array<GameObject>;
    public nw: QuadTree;
    public ne: QuadTree;
    public sw: QuadTree;
    public se: QuadTree;

    constructor(boundaryAABB: AABB){
        this.boundaryAABB = boundaryAABB;
        this.gameObjects = [];
        this.nw = null;
        this.ne = null;
        this.sw = null;
        this.se = null;
    }
    public insert(object: GameObject): boolean {
        if (!this.boundaryAABB.containsObject(object)) {
            return false;
        }
        if (this.gameObjects.length < QuadTree.size && this.nw == null) {
            this.gameObjects.push(object);
            return true;
        }
        if (this.nw == null) {
            this.subdivide();
        }
        if (this.nw.insert(object)) { return true; };
        if (this.ne.insert(object)) { return true; };
        if (this.sw.insert(object)) { return true; };
        if (this.se.insert(object)) { return true; };
        return false;
    }
    public subdivide(): void {
        const quarterLength = this.boundaryAABB.halfLength / 2;
        this.nw = new QuadTree(new AABB(this.boundaryAABB.x - quarterLength,
                                this.boundaryAABB.y - quarterLength,quarterLength));
        this.ne = new QuadTree(new AABB(this.boundaryAABB.x + quarterLength,
                                this.boundaryAABB.y - quarterLength,quarterLength));
        this.sw = new QuadTree(new AABB(this.boundaryAABB.x - quarterLength,
                                this.boundaryAABB.y + quarterLength,quarterLength));
        this.se = new QuadTree(new AABB(this.boundaryAABB.x + quarterLength,
                                this.boundaryAABB.y + quarterLength,quarterLength));
        //If 4 game objects are sitting right on top of each other, 
        //Max call stack size will get exceeded
        // for (let object of this.gameObjects){
        //     this.insert(object);
        // }
        // this.gameObjects = [];
    }
    public queryRange(rangeAABB: AABB) {
        //Gets all balls within the AABB range
        let foundObjects: Array<GameObject> = [];
        //I guess intersectsAABB is used because 
        //you might have an AABB that isn't a complete quad
        //if length is 4, AABB could be 3
        if (!this.boundaryAABB.intersectsAABB(rangeAABB)) {
            return foundObjects;
        }
        for (let c of this.gameObjects) {
            if (rangeAABB.containsObject(c)) {
                foundObjects.push(c);
            }
        }
        if (this.nw == null) {
            return foundObjects;
        }
        //push will push the entire array, ex: [1,2,[3,4]]
        //push.apply pushes each element of the array seperately ex: [1,2,3,4]
        Array.prototype.push.apply(foundObjects, this.nw.queryRange(rangeAABB));
        Array.prototype.push.apply(foundObjects, this.ne.queryRange(rangeAABB));
        Array.prototype.push.apply(foundObjects, this.sw.queryRange(rangeAABB));
        Array.prototype.push.apply(foundObjects, this.se.queryRange(rangeAABB));
        return foundObjects;
    }
}