(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
var BulletType;
(function (BulletType) {
    BulletType["FAST"] = "fast";
    BulletType["LINE"] = "line";
    BulletType["NORMAL"] = "bullet";
})(BulletType = exports.BulletType || (exports.BulletType = {}));
class Bullet extends index_js_1.GameObject {
    constructor(position, direction, id, hp = 1, maxVel = 10) {
        super(position);
        this.id = id;
        this.direction = direction;
        this.maxVelocity = maxVel;
        this.normalizeDirection();
        this.hp = hp;
        this.lifetime = 1000;
        this.type = "bullet";
        this.damage = 1;
        this.firstTick = true;
    }
    update() {
        if (this.firstTick) {
            this.firstTick = false;
            return;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
    }
    factionCheck(object) {
        return !(this.id === object.id);
    }
    takeDamage(object) {
        this.hp -= (object.getDamage() + 1);
        this.updateStatus();
        return this.hp;
    }
}
exports.Bullet = Bullet;

},{"./index.js":15}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Controls {
    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.mouseDown = false;
        this.mousePosition = new index_js_1.Vector();
        this.mouseRadian = 0;
    }
    testMethod() {
        return true;
    }
}
exports.Controls = Controls;

},{"./index.js":15}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
var EnemyType;
(function (EnemyType) {
    EnemyType["ZOMBIE"] = "zombie";
})(EnemyType = exports.EnemyType || (exports.EnemyType = {}));
class Enemy extends index_js_1.GameObject {
    constructor(position) {
        super(position);
    }
    update(players) {
        this.ai(players);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
    }
    wallCollision() {
        if (this.position.x - this.radius < 0) {
            this.direction.x = 0;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.x = 0;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.direction.y = 0;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.y = 0;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    reloadCheck() {
        return this.weapon.reloadCheck();
    }
    targetCheck(players) {
        return (players.hasOwnProperty(this.target) && players[this.target] !== undefined);
    }
}
exports.Enemy = Enemy;

},{"./index.js":15}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class FastBullet extends index_js_1.Bullet {
    constructor(position, velocity, id, hp, maxVel = 50) {
        super(position, velocity, id, hp, maxVel);
        this.radius = 2;
        this.type = index_js_1.BulletType.FAST;
    }
    collisionCheck(object) {
        const endX = this.position.x + this.velocity.x;
        const endY = this.position.y + this.velocity.y;
        const endPos = new index_js_1.Vector(endX, endY);
        return this.pointLineDistanceSquared(this.position, endPos, object.position) < Math.pow(object.getRadius(), 2);
    }
    pointLineDistanceSquared(p1, p2, o1) {
        //https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        const deltaX = p2.x - p1.x;
        const deltaY = p2.y - p1.y;
        const lineLengthSquared = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
        //Finds the place on line closest to the point
        let t = ((o1.x - p1.x) * deltaX + (o1.y - p1.y) * deltaY) / lineLengthSquared;
        t = Math.max(0, Math.min(1, t));
        return (Math.pow((o1.x - (p1.x + t * deltaX)), 2) + Math.pow((o1.y - (p1.y + t * deltaY)), 2));
    }
}
exports.FastBullet = FastBullet;

},{"./index.js":15}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class GameClient {
    static init() {
        index_js_1.GameMap.init();
        GameClient.controls = new index_js_1.Controls();
        document.onkeydown = function (e) {
            switch (e.key) {
                case "a":
                    GameClient.controls.left = true;
                    break;
                case "d":
                    GameClient.controls.right = true;
                    break;
                case "w":
                    GameClient.controls.up = true;
                    break;
                case "s":
                    GameClient.controls.down = true;
                    break;
            }
        };
        document.onkeyup = function (e) {
            switch (e.key) {
                case "a":
                    GameClient.controls.left = false;
                    break;
                case "d":
                    GameClient.controls.right = false;
                    break;
                case "w":
                    GameClient.controls.up = false;
                    break;
                case "s":
                    GameClient.controls.down = false;
                    break;
            }
        };
        document.onmousemove = function (e) {
            GameClient.event = e;
            GameClient.controls.mousePosition = GameClient.getMousePos();
        };
        document.onmousedown = function (e) {
            GameClient.controls.mouseDown = true;
        };
        document.onmouseup = function (e) {
            GameClient.controls.mouseDown = false;
        };
        GameClient.socket = io();
        GameClient.socket.on("state", function (data) {
            GameClient.debugDraw(data);
        });
        GameClient.socket.on("id", function (socketID) {
            GameClient.id = socketID;
        });
        GameClient.gameLoop = setInterval(function () {
            GameClient.socket.emit("userInput", GameClient.controls);
        }, 1000 / 60);
    }
    static draw(data) {
        index_js_1.GameMap.clear();
        let self;
        for (let j in data) {
            //really bad method of checking if the object is a Player
            //Sockets can only emit Json and not the class
            if (data[j].id === GameClient.id && data[j].hasOwnProperty("connected")) {
                self = data[j];
            }
        }
        const centerX = self.position.x - index_js_1.GameMap.getWidth() / 2;
        const centerY = self.position.y - index_js_1.GameMap.getHeight() / 2;
        for (let gameObject in data) {
            const gameObj = data[gameObject];
            const deltaX = gameObj.position.x - centerX;
            const deltaY = gameObj.position.y - centerY;
            const cRadius = gameObj.radius;
            if (gameObj.type === "fastbullet") {
                const endX = deltaX + gameObj.direction.x * gameObj.maxVelocity;
                const endY = deltaY + gameObj.direction.y * gameObj.maxVelocity;
                if (gameObj.isCollided) {
                    index_js_1.GameMap.ctx.beginPath();
                    index_js_1.GameMap.ctx.strokeStyle = "red";
                    index_js_1.GameMap.ctx.moveTo(deltaX, deltaY);
                    index_js_1.GameMap.ctx.lineTo(endX, endY);
                    index_js_1.GameMap.ctx.stroke();
                }
                else {
                    index_js_1.GameMap.ctx.beginPath();
                    index_js_1.GameMap.ctx.strokeStyle = "black";
                    index_js_1.GameMap.ctx.moveTo(deltaX, deltaY);
                    index_js_1.GameMap.ctx.lineTo(endX, endY);
                    index_js_1.GameMap.ctx.stroke();
                }
            }
            else {
                if (gameObj.isCollided) {
                    index_js_1.GameMap.ctx.beginPath();
                    index_js_1.GameMap.ctx.fillStyle = "red";
                    index_js_1.GameMap.ctx.arc(deltaX, deltaY, gameObj.radius, 0, Math.PI * 2, true);
                    index_js_1.GameMap.ctx.fill();
                }
                else {
                    index_js_1.GameMap.ctx.beginPath();
                    index_js_1.GameMap.ctx.strokeStyle = "black";
                    index_js_1.GameMap.ctx.arc(deltaX, deltaY, gameObj.radius, 0, Math.PI * 2);
                    index_js_1.GameMap.ctx.stroke();
                }
            }
        }
        const borderX = index_js_1.GameMap.getWidth() / 2 - self.position.x;
        const borderY = index_js_1.GameMap.getHeight() / 2 - self.position.y;
        index_js_1.GameMap.ctx.strokeStyle = "black";
        index_js_1.GameMap.ctx.rect(borderX, borderY, index_js_1.GameMap.HALF_DIMENSION * 2, index_js_1.GameMap.HALF_DIMENSION * 2);
        index_js_1.GameMap.ctx.stroke();
        GameClient.drawGameBox();
        GameClient.drawStatBox();
        GameClient.drawStats(self);
        GameClient.drawHPBar(self);
    }
    static debugDraw(data) {
        index_js_1.GameMap.clear();
        let self;
        for (let j in data) {
            //really bad method of checking if the object is a Player
            //Sockets can only emit Json and not the class
            if (data[j].id === GameClient.id && data[j].hasOwnProperty("connected")) {
                self = data[j];
            }
        }
        const centerX = self.position.x - index_js_1.GameMap.getWidth() / 2;
        const centerY = self.position.y - index_js_1.GameMap.getHeight() / 2;
        for (let gameObject in data) {
            if (data[gameObject].hasOwnProperty("nw")) {
                GameClient.drawQuadrants(data.quads, index_js_1.GameMap.ctx, self.position.x, self.position.y);
            }
            else if (data[gameObject] !== null) {
                const gameObj = data[gameObject];
                const deltaX = gameObj.position.x - centerX;
                const deltaY = gameObj.position.y - centerY;
                const cRadius = gameObj.radius;
                if (gameObj.type === index_js_1.BulletType.FAST) {
                    const endX = deltaX + gameObj.direction.x * gameObj.maxVelocity;
                    const endY = deltaY + gameObj.direction.y * gameObj.maxVelocity;
                    if (gameObj.isCollided) {
                        index_js_1.GameMap.ctx.beginPath();
                        index_js_1.GameMap.ctx.strokeStyle = "red";
                        index_js_1.GameMap.ctx.moveTo(deltaX, deltaY);
                        index_js_1.GameMap.ctx.lineTo(endX, endY);
                        index_js_1.GameMap.ctx.stroke();
                    }
                    else {
                        index_js_1.GameMap.ctx.beginPath();
                        index_js_1.GameMap.ctx.strokeStyle = "blue";
                        index_js_1.GameMap.ctx.moveTo(deltaX, deltaY);
                        index_js_1.GameMap.ctx.lineTo(endX, endY);
                        index_js_1.GameMap.ctx.stroke();
                    }
                }
                else if (gameObj.type === index_js_1.BulletType.LINE) {
                    const currPos = new index_js_1.Vector(deltaX, deltaY);
                    const currVel = new index_js_1.Vector(gameObj.direction.x, gameObj.direction.y);
                    const direction1 = currVel.cPerpRotation().multiply(new index_js_1.Vector(gameObj.width / 2, gameObj.width / 2));
                    const direction2 = currVel.cCPerpRotation().multiply(new index_js_1.Vector(gameObj.width / 2, gameObj.width / 2));
                    const end1 = currPos.clone().add(direction1);
                    const end2 = currPos.clone().add(direction2);
                    if (gameObj.isCollided) {
                        index_js_1.GameMap.ctx.beginPath();
                        index_js_1.GameMap.ctx.strokeStyle = "red";
                        index_js_1.GameMap.ctx.moveTo(end1.x, end1.y);
                        index_js_1.GameMap.ctx.lineTo(end2.x, end2.y);
                        index_js_1.GameMap.ctx.stroke();
                    }
                    else {
                        index_js_1.GameMap.ctx.beginPath();
                        index_js_1.GameMap.ctx.strokeStyle = "black";
                        index_js_1.GameMap.ctx.moveTo(end1.x, end1.y);
                        index_js_1.GameMap.ctx.lineTo(end2.x, end2.y);
                        index_js_1.GameMap.ctx.stroke();
                    }
                }
                else {
                    if (gameObj.isCollided) {
                        index_js_1.GameMap.ctx.beginPath();
                        index_js_1.GameMap.ctx.fillStyle = "red";
                        index_js_1.GameMap.ctx.arc(deltaX, deltaY, gameObj.radius, 0, Math.PI * 2, true);
                        index_js_1.GameMap.ctx.fill();
                    }
                    else {
                        index_js_1.GameMap.ctx.beginPath();
                        index_js_1.GameMap.ctx.strokeStyle = "black";
                        index_js_1.GameMap.ctx.arc(deltaX, deltaY, gameObj.radius, 0, Math.PI * 2);
                        index_js_1.GameMap.ctx.stroke();
                    }
                }
            }
        }
        const borderX = index_js_1.GameMap.getWidth() / 2 - self.position.x;
        const borderY = index_js_1.GameMap.getHeight() / 2 - self.position.y;
        index_js_1.GameMap.ctx.strokeStyle = "black";
        index_js_1.GameMap.ctx.rect(borderX, borderY, index_js_1.GameMap.HALF_DIMENSION * 2, index_js_1.GameMap.HALF_DIMENSION * 2);
        index_js_1.GameMap.ctx.stroke();
        GameClient.drawGameBox();
        GameClient.drawStatBox();
        GameClient.drawStats(self);
        GameClient.drawHPBar(self);
    }
    static drawGameBox() {
        index_js_1.GameMap.ctx.beginPath();
        index_js_1.GameMap.ctx.strokeStyle = "black";
        index_js_1.GameMap.ctx.rect(0, 0, index_js_1.GameMap.getWidth(), index_js_1.GameMap.getHeight());
        index_js_1.GameMap.ctx.stroke();
    }
    static drawStatBox() {
        index_js_1.GameMap.ctx.beginPath();
        index_js_1.GameMap.ctx.clearRect(index_js_1.GameMap.getWidth(), 0, index_js_1.GameMap.UIWidth, index_js_1.GameMap.getHeight());
        index_js_1.GameMap.ctx.strokeStyle = "black";
        index_js_1.GameMap.ctx.rect(index_js_1.GameMap.getWidth(), 0, index_js_1.GameMap.UIWidth, index_js_1.GameMap.getHeight());
        index_js_1.GameMap.ctx.stroke();
    }
    static drawHPBar(player) {
        index_js_1.GameMap.ctx.beginPath();
        index_js_1.GameMap.ctx.strokeStyle = "black";
        index_js_1.GameMap.ctx.fillStyle = "red";
        index_js_1.GameMap.ctx.rect(index_js_1.GameMap.getWidth() + index_js_1.GameMap.UIWidth / 10, index_js_1.GameMap.getHeight() / 4, index_js_1.GameMap.UIWidth * 0.8, index_js_1.GameMap.getHeight() * 0.025);
        //GameMap.ctx.fillRect(GameMap.getWidth() + GameMap.UIWidth / 10, GameMap.getHeight() / 4, GameMap.UIWidth * 0.8 * (player.hp / player.hpMax), GameMap.getHeight()* 0.025);
        //Fixed code, but the above code looks more funny
        index_js_1.GameMap.ctx.fillRect(index_js_1.GameMap.getWidth() + index_js_1.GameMap.UIWidth / 10, index_js_1.GameMap.getHeight() / 4, index_js_1.GameMap.UIWidth * 0.8 * Math.max(0, (player.hp / player.hpMax)), index_js_1.GameMap.getHeight() * 0.025);
        index_js_1.GameMap.ctx.stroke();
    }
    static drawStats(player) {
        index_js_1.GameMap.ctx.beginPath();
        index_js_1.GameMap.ctx.font = "14px sans-serif";
        index_js_1.GameMap.ctx.fillStyle = "black";
        index_js_1.GameMap.ctx.textAlign = "left";
        index_js_1.GameMap.ctx.fillText("HP: " + player.hp + " / " + player.hpMax, index_js_1.GameMap.getWidth() + index_js_1.GameMap.UIWidth / 10, index_js_1.GameMap.getHeight() / 4 + index_js_1.GameMap.getHeight() / 10);
        //GameMap.ctx.fillText("Gold: " + player.gold, GameMap.getWidth() + GameMap.UIWidth / 10, GameMap.getHeight() / 4 + GameMap.getHeight() / 7.5);
        index_js_1.GameMap.ctx.font = "10px sans-serif";
    }
    static drawQuadrants(currentQ, ctx, selfX, selfY) {
        if (currentQ.nw != null) {
            GameClient.drawQuadrants(currentQ.nw, ctx, selfX, selfY);
            GameClient.drawQuadrants(currentQ.ne, ctx, selfX, selfY);
            GameClient.drawQuadrants(currentQ.sw, ctx, selfX, selfY);
            GameClient.drawQuadrants(currentQ.se, ctx, selfX, selfY);
        }
        else {
            ctx.beginPath();
            ctx.rect(currentQ.boundaryAABB.x - currentQ.boundaryAABB.halfLength + index_js_1.GameMap.getWidth() / 2 - selfX, currentQ.boundaryAABB.y - currentQ.boundaryAABB.halfLength + index_js_1.GameMap.getHeight() / 2 - selfY, 2 * currentQ.boundaryAABB.halfLength, 2 * currentQ.boundaryAABB.halfLength);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';
            ctx.closePath();
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }
    static drawBlockers() {
        const cameraAngle = GameClient.getMousePos().getAngle();
        index_js_1.GameMap.ctx.beginPath();
        index_js_1.GameMap.ctx.fillStyle = "black";
        index_js_1.GameMap.ctx.moveTo(300, 300);
        index_js_1.GameMap.ctx.arc(300, 300, 425, cameraAngle + Math.PI * 15 / 180, cameraAngle - Math.PI * 15 / 180);
        index_js_1.GameMap.ctx.closePath();
        index_js_1.GameMap.ctx.fill();
    }
    static getMousePos() {
        const rect = index_js_1.GameMap.canvas.getBoundingClientRect();
        if (GameClient.event === undefined) {
            return new index_js_1.Vector(0, 0);
        }
        return new index_js_1.Vector(GameClient.event.clientX - rect.left - index_js_1.GameMap.getWidth() / 2, GameClient.event.clientY - rect.top - index_js_1.GameMap.getHeight() / 2);
    }
}
GameClient.init();

},{"./index.js":15}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameMap {
    static init() {
        GameMap.UIWidth = 200;
        GameMap.canvas = document.querySelector("canvas");
        GameMap.canvas.height = 600;
        GameMap.canvas.width = 600 + GameMap.UIWidth;
        GameMap.ctx = GameMap.canvas.getContext("2d");
    }
    // public static updateWidth(width: number): void {
    //     GameMap.canvas.width = width;
    // }
    static getWidth() {
        return GameMap.canvas.width - GameMap.UIWidth;
    }
    static getCanvasWidth() {
        return GameMap.canvas.width;
    }
    // public static updateHeight(height: number): void {
    //     GameMap.canvas.height = height;
    // }
    static getHeight() {
        return GameMap.canvas.height;
    }
    static clear() {
        GameMap.ctx.clearRect(0, 0, GameMap.getCanvasWidth(), GameMap.getHeight());
    }
}
exports.GameMap = GameMap;
GameMap.HALF_DIMENSION = 500;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class GameObject {
    constructor(position) {
        this.position = position;
        this.radius = 10;
        this.maxVelocity = 5;
        this.direction = new index_js_1.Vector();
        this.isCollided = false;
        this.isAlive = true;
        this.damage = 0;
    }
    get velocity() {
        return this.direction.clone().multiply(this.maxVelocity);
    }
    getPosition() {
        return this.position;
    }
    setPosition(x, y) {
        this.position.set(x, y);
    }
    getDirection() {
        return this.direction;
    }
    setDirection(a, b) {
        if (a instanceof index_js_1.Vector || b === null) {
            this.direction.set(a);
        }
        else {
            this.direction.set(a, b);
        }
        this.normalizeDirection();
        return this.direction;
    }
    normalizeDirection() {
        this.direction.normalize();
    }
    getRadius() {
        return this.radius;
    }
    getDistance(a) {
        return Math.sqrt(Math.pow((this.position.x - a.position.x), 2) + Math.pow((this.position.y - a.position.y), 2));
    }
    collisionCheck(testObject) {
        const testPosition = testObject.getPosition();
        const testRadius = testObject.getRadius();
        const deltaX = this.position.x - testPosition.x;
        const deltaY = this.position.y - testPosition.y;
        const totalRadius = this.radius + testRadius;
        return (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) <= Math.pow(totalRadius, 2));
    }
    getDamage() {
        return this.damage;
    }
    updateStatus() {
        //Returns false if the object has 0 hp
        if (this.hp <= 0) {
            this.isAlive = false;
        }
        return this.isAlive;
    }
    wallCollision() {
        //Default behavior is to have objects "bounce" off walls
        if (this.position.x - this.radius < 0) {
            this.direction.x = -this.direction.x;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.x = -this.direction.x;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.direction.y = -this.direction.y;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.y = -this.direction.y;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
}
exports.GameObject = GameObject;

},{"./index.js":15}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class LineBullet extends index_js_1.Bullet {
    constructor(position, velocity, id, hp, maxVel = 10, width = 20) {
        super(position, velocity, id, hp, maxVel);
        this.width = width;
        this.type = index_js_1.BulletType.LINE;
        // const rectCenterX: number = this.position.x + this.velocity.x / 2;
        // const rectCenterY: number = this.position.y + this.velocity.y / 2;
        // this.rect = new Rectangle(rectCenterX, rectCenterY, this.maxVelocity, this.width, true);
    }
    get rect() {
        //the width of the bullet is the height of the collision rectange
        const rectCenterX = this.position.x + this.velocity.x / 2;
        const rectCenterY = this.position.y + this.velocity.y / 2;
        return new index_js_1.Rectangle(rectCenterX, rectCenterY, this.maxVelocity, this.width, true);
    }
    wallCollision() {
        if (this.position.x - this.width / 2 < 0) {
            this.direction.x = -this.direction.x;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.width / 2 > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.x = -this.direction.x;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.width / 2 < 0) {
            this.direction.y = -this.direction.y;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.width / 2 > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.y = -this.direction.y;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    collisionCheck(object) {
        const rectAngle = Math.atan2(this.direction.y, this.direction.x);
        const rectCenterX = this.rect.centerX;
        const rectCenterY = this.rect.centerY;
        //console.log("Rect Center Position: ", rectCenterX, rectCenterY, rectAngle);
        //console.log("Object Position: ", object.position.x, object.position.y);
        const unrotatedCircleX = Math.cos(rectAngle) * (object.position.x - rectCenterX) -
            Math.sin(rectAngle) * (object.position.y - rectCenterY) + rectCenterX;
        const unrotatedCircleY = Math.sin(rectAngle) * (object.position.x - rectCenterX) +
            Math.cos(rectAngle) * (object.position.y - rectCenterY) + rectCenterY;
        //console.log("current position: " + this.position.x + " " + this.position.y);
        return this.rectCircleCollision(unrotatedCircleX, unrotatedCircleY, object.getRadius());
    }
    rectCircleCollision(uCX, uCY, radius) {
        //ahhhhhh i don't want to make a circle class, so here i am
        //http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/
        //console.log("rotated coords ", uCX, uCY)
        let closestX, closestY;
        const rect = this.rect;
        if (uCX < rect.x) {
            closestX = rect.x;
        }
        else if (uCX > rect.x + rect.width) {
            closestX = rect.x + rect.width;
        }
        else {
            closestX = uCX;
        }
        if (uCY < rect.y) {
            closestY = rect.y;
        }
        else if (uCY > rect.y + rect.height) {
            closestY = rect.y + rect.height;
        }
        else {
            closestY = uCY;
        }
        const distance = Math.sqrt(Math.pow((uCX - closestX), 2) + Math.pow((uCY - closestY), 2));
        //console.log("closest point : " + closestX + " " + closestY);
        //console.log("distance ", distance);
        if (distance < radius) {
            return true;
        }
        return false;
    }
}
exports.LineBullet = LineBullet;

},{"./index.js":15}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Player extends index_js_1.GameObject {
    constructor(position, id) {
        super(position);
        this.id = id;
        this.connected = true;
        this.maxVelocity = 5;
        this.radius = 15;
        this.hp = 10;
        this.hpMax = this.hp;
        //todo: enum
        this.type = "player";
        //this.weapon = new SuperWeapon(id);
        this.weapon = new index_js_1.Sword(id);
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
    }
    updateMovement(controls) {
        this.direction.reset();
        if (controls.left === true) {
            this.direction.x -= 1;
        }
        if (controls.right === true) {
            this.direction.x += 1;
        }
        if (controls.up === true) {
            this.direction.y -= 1;
        }
        if (controls.down === true) {
            this.direction.y += 1;
        }
        this.normalizeDirection();
    }
    wallCollision() {
        if (this.position.x - this.radius < 0) {
            this.direction.x = 0;
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.x = 0;
            this.position.x = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.direction.y = 0;
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > index_js_1.GameMap.HALF_DIMENSION * 2) {
            this.direction.y = 0;
            this.position.y = index_js_1.GameMap.HALF_DIMENSION * 2 - this.radius;
        }
    }
    disconnect() {
        this.connected = false;
    }
    reloadCheck() {
        return this.weapon.reloadCheck();
    }
    fireWeapon(controls) {
        return this.weapon.fireWeapon(this.position.clone(), controls.mousePosition);
    }
    takeDamage(object) {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}
exports.Player = Player;

},{"./index.js":15}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class QuadTree {
    constructor(boundaryAABB) {
        this.boundaryAABB = boundaryAABB;
        this.gameObjects = [];
        this.nw = null;
        this.ne = null;
        this.sw = null;
        this.se = null;
    }
    insert(object) {
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
        if (this.nw.insert(object)) {
            return true;
        }
        ;
        if (this.ne.insert(object)) {
            return true;
        }
        ;
        if (this.sw.insert(object)) {
            return true;
        }
        ;
        if (this.se.insert(object)) {
            return true;
        }
        ;
        return false;
    }
    subdivide() {
        const quarterLength = this.boundaryAABB.halfLength / 2;
        this.nw = new QuadTree(new index_js_1.AABB(this.boundaryAABB.x - quarterLength, this.boundaryAABB.y - quarterLength, quarterLength));
        this.ne = new QuadTree(new index_js_1.AABB(this.boundaryAABB.x + quarterLength, this.boundaryAABB.y - quarterLength, quarterLength));
        this.sw = new QuadTree(new index_js_1.AABB(this.boundaryAABB.x - quarterLength, this.boundaryAABB.y + quarterLength, quarterLength));
        this.se = new QuadTree(new index_js_1.AABB(this.boundaryAABB.x + quarterLength, this.boundaryAABB.y + quarterLength, quarterLength));
        //If 4 game objects are sitting right on top of each other, 
        //Max call stack size will get exceeded
        // for (let object of this.gameObjects){
        //     this.insert(object);
        // }
        // this.gameObjects = [];
    }
    queryRange(rangeAABB) {
        //Gets all balls within the AABB range
        let foundObjects = [];
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
exports.QuadTree = QuadTree;
//https://medium.com/mytake/collision-detection-using-quad-tree-data-structure-ff7f6e8b819
QuadTree.size = 3;

},{"./index.js":15}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x = 0, y = 0) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    normalize() {
        const magnitude = this.magnitude;
        if (magnitude !== 0) {
            this.x = this.x / magnitude;
            this.y = this.y / magnitude;
        }
    }
    cPerpRotation() {
        //clockwise Perpendicular rotation
        return new Vector(this.y, -this.x);
    }
    cCPerpRotation() {
        //counterClockwise Perpendicular rotation
        return new Vector(-this.y, this.x);
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    reset() {
        return this.set(0, 0);
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    add(a, b) {
        if (a instanceof Vector) {
            this.x += a.x;
            this.y += a.y;
        }
        else {
            this.x += a;
            this.y += (b != null) ? b : a;
        }
        return this;
    }
    subtract(a, b) {
        if (a instanceof Vector) {
            this.x -= a.x;
            this.y -= a.y;
        }
        else {
            this.x -= a;
            this.y -= (b != null) ? b : a;
        }
        return this;
    }
    multiply(a, b) {
        if (a instanceof Vector) {
            this.x *= a.x;
            this.y *= a.y;
        }
        else {
            this.x *= a;
            this.y *= (b != null) ? b : a;
        }
        return this;
    }
    scaleTo(a, b) {
        this.normalize();
        if (b === null) {
            return this.multiply(a);
        }
        else {
            return this.multiply(a, b);
        }
    }
    set(a, b) {
        if (a instanceof Vector) {
            this.x = a.x;
            this.y = a.y;
        }
        else {
            this.x = a;
            this.y = (b != null) ? b : a;
        }
        return this;
    }
    distance(a) {
        return Math.sqrt(Math.pow((this.x - a.position.x), 2) + Math.pow((this.y - a.position.y), 2));
    }
}
exports.Vector = Vector;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
class Zombie extends index_js_1.Enemy {
    constructor(position, id) {
        super(position);
        this.radius = 15;
        this.maxVelocity = 3;
        this.hp = 10;
        this.type = index_js_1.EnemyType.ZOMBIE;
        this.id = id;
        this.weapon = new index_js_1.Gun(this.id, 1, 1000, 5);
        this.target = null;
    }
    reloadCheck() {
        return this.weapon.reloadCheck();
    }
    ai(players) {
        if (players.hasOwnProperty(this.target)) {
            let target = players[this.target];
            if (players[this.target] !== undefined) {
                this.direction = new index_js_1.Vector(target.position.x - this.position.x, target.position.y - this.position.y);
                this.normalizeDirection();
            }
            //I don't feel like typing out players[this.target];
            else {
                this.findTarget(players);
            }
        }
        else {
            this.findTarget(players);
        }
    }
    targetCheck(players) {
        return (players.hasOwnProperty(this.target) && players[this.target] !== undefined);
    }
    findTarget(players) {
        let smallestValue = Number.POSITIVE_INFINITY;
        let currentP = null;
        for (let p in players) {
            let currentDist = this.getDistance(players[p]);
            if (currentDist < smallestValue) {
                smallestValue = currentDist;
                currentP = p;
            }
        }
        if (currentP !== null) {
            this.target = currentP;
        }
    }
    attack(players) {
        let targetVec = players[this.target].position.clone();
        return this.weapon.fireWeapon(this.position.clone(), targetVec.subtract(this.position));
    }
    takeDamage(object) {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}
exports.Zombie = Zombie;

},{"./index.js":15}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameObject_js_1 = require("./GameObject.js");
exports.GameObject = GameObject_js_1.GameObject;
const Controls_js_1 = require("./Controls.js");
exports.Controls = Controls_js_1.Controls;
const Vector_js_1 = require("./Vector.js");
exports.Vector = Vector_js_1.Vector;
const GameMap_js_1 = require("./GameMap.js");
exports.GameMap = GameMap_js_1.GameMap;
const Bullet_js_1 = require("./Bullet.js");
exports.Bullet = Bullet_js_1.Bullet;
exports.BulletType = Bullet_js_1.BulletType;
const Player_js_1 = require("./Player.js");
exports.Player = Player_js_1.Player;
const Enemy_js_1 = require("./Enemy.js");
exports.Enemy = Enemy_js_1.Enemy;
exports.EnemyType = Enemy_js_1.EnemyType;
const Zombie_js_1 = require("./Zombie.js");
exports.Zombie = Zombie_js_1.Zombie;
const AABB_js_1 = require("./AABB.js");
exports.AABB = AABB_js_1.AABB;
const Rectangle_1 = require("./Rectangle");
exports.Rectangle = Rectangle_1.Rectangle;
const QuadTree_js_1 = require("./QuadTree.js");
exports.QuadTree = QuadTree_js_1.QuadTree;
const FastBullet_js_1 = require("./FastBullet.js");
exports.FastBullet = FastBullet_js_1.FastBullet;
const LineBullet_js_1 = require("./LineBullet.js");
exports.LineBullet = LineBullet_js_1.LineBullet;
const Weapon_1 = require("./weapons/Weapon");
exports.Weapon = Weapon_1.Weapon;
exports.WeaponType = Weapon_1.WeaponType;
const Sniper_1 = require("./weapons/Sniper");
exports.Sniper = Sniper_1.Sniper;
const Sword_1 = require("./weapons/Sword");
exports.Sword = Sword_1.Sword;
const Gun_1 = require("./weapons/Gun");
exports.Gun = Gun_1.Gun;
const SuperWeapon_1 = require("./weapons/SuperWeapon");
exports.SuperWeapon = SuperWeapon_1.SuperWeapon;

},{"./AABB.js":1,"./Bullet.js":2,"./Controls.js":3,"./Enemy.js":4,"./FastBullet.js":5,"./GameMap.js":7,"./GameObject.js":8,"./LineBullet.js":9,"./Player.js":10,"./QuadTree.js":11,"./Rectangle":12,"./Vector.js":13,"./Zombie.js":14,"./weapons/Gun":16,"./weapons/Sniper":17,"./weapons/SuperWeapon":18,"./weapons/Sword":19,"./weapons/Weapon":20}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const uuid_1 = require("uuid");
class Gun extends index_js_1.Weapon {
    constructor(owner, damage = 1, cooldown = 500, bulletVelocity = 10) {
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = bulletVelocity;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
    }
    fireWeapon(selfPos, targetPos) {
        const bullets = {};
        const id = uuid_1.v4();
        this.bulletCount += 1;
        this.lastFired = new Date();
        bullets[id] = new index_js_1.Bullet(selfPos, new index_js_1.Vector(targetPos.x, targetPos.y), this.owner, 1, this.bulletVelocity);
        return bullets;
    }
}
exports.Gun = Gun;

},{"../index.js":15,"uuid":22}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const uuid_1 = require("uuid");
class Sniper extends index_js_1.Weapon {
    constructor(owner, damage = 1, cooldown = 2000, bulletVelocity = 30) {
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = bulletVelocity;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
    }
    fireWeapon(selfPos, targetDir) {
        const bullets = {};
        const id = uuid_1.v4();
        this.bulletCount += 1;
        this.lastFired = new Date();
        bullets[id] = new index_js_1.FastBullet(selfPos, targetDir, this.owner, 1, this.bulletVelocity);
        return bullets;
    }
}
exports.Sniper = Sniper;

},{"../index.js":15,"uuid":22}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const uuid_1 = require("uuid");
class SuperWeapon extends index_js_1.Weapon {
    constructor(owner, damage = 20, cooldown = 1, bulletVelocity = 30) {
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = bulletVelocity;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
    }
    fireWeapon(selfPos, targetDir) {
        const bullets = {};
        const id = uuid_1.v4();
        this.bulletCount += 1;
        this.lastFired = new Date();
        bullets[id] = new index_js_1.FastBullet(selfPos, targetDir.clone(), this.owner, 10, this.bulletVelocity);
        return bullets;
    }
}
exports.SuperWeapon = SuperWeapon;

},{"../index.js":15,"uuid":22}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../index.js");
const uuid_1 = require("uuid");
class Sword extends index_js_1.Weapon {
    constructor(owner, damage = 2, cooldown = 250, velocity = 30) {
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = 30;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
        this.rightSide = true;
    }
    fireWeapon(selfPos, targetDir) {
        //targetDir is a non-unit vector that is the aim relative to the user
        //targetPos is that coordinate but in absolute units, not relative to the user
        //shiftedPos is offset from the user, makes shots come in slightly from the side
        //modfiedTargetDir is non-unit aim relative to the bullet
        const bullets = {};
        const id = uuid_1.v4();
        const targetPos = selfPos.clone().add(targetDir);
        this.bulletCount += 1;
        this.lastFired = new Date();
        const shiftedPos = this.rightSide ? selfPos.add(targetDir.cPerpRotation().scaleTo(50))
            : selfPos.add(targetDir.cCPerpRotation().scaleTo(50));
        let modifiedTargetDir = targetPos.clone().subtract(shiftedPos);
        bullets[id] = new index_js_1.LineBullet(shiftedPos, modifiedTargetDir, this.owner, 1, 10, 30);
        this.rightSide = !this.rightSide;
        return bullets;
    }
}
exports.Sword = Sword;

},{"../index.js":15,"uuid":22}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WeaponType;
(function (WeaponType) {
    WeaponType["SNIPER"] = "sniper";
    WeaponType["SWORD"] = "sword";
    WeaponType["SUPERWEAPON"] = "superWeapon";
})(WeaponType = exports.WeaponType || (exports.WeaponType = {}));
class Weapon {
    constructor(owner) {
        this.owner = owner;
    }
    reloadCheck() {
        const currentTime = new Date();
        if (currentTime.getTime() - this.lastFiredNumber() >= this.cooldown) {
            return true;
        }
        return false;
    }
    lastFiredNumber() {
        return this.lastFired.getTime();
    }
    getBulletCount() {
        return this.bulletCount;
    }
}
exports.Weapon = Weapon;

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

  return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
}

var _default = bytesToUuid;
exports.default = _default;
module.exports = exports.default;
},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});

var _v = _interopRequireDefault(require("./v1.js"));

var _v2 = _interopRequireDefault(require("./v3.js"));

var _v3 = _interopRequireDefault(require("./v4.js"));

var _v4 = _interopRequireDefault(require("./v5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./v1.js":26,"./v3.js":27,"./v4.js":29,"./v5.js":30}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes == 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Array(msg.length);

    for (var i = 0; i < msg.length; i++) bytes[i] = msg.charCodeAt(i);
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var i;
  var x;
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';
  var hex;

  for (i = 0; i < length32; i += 8) {
    x = input[i >> 5] >>> i % 32 & 0xff;
    hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  var i;
  var olda;
  var oldb;
  var oldc;
  var oldd;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  var i;
  var output = [];
  output[(input.length >> 2) - 1] = undefined;

  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }

  var length8 = input.length * 8;

  for (i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

var _default = md5;
exports.default = _default;
module.exports = exports.default;
},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

function rng() {
  if (!getRandomValues) {
    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
  }

  return getRandomValues(rnds8);
}

module.exports = exports.default;
},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes == 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Array(msg.length);

    for (var i = 0; i < msg.length; i++) bytes[i] = msg.charCodeAt(i);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var i = 0; i < N; i++) {
    M[i] = new Array(16);

    for (var j = 0; j < 16; j++) {
      M[i][j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var i = 0; i < N; i++) {
    var W = new Array(80);

    for (var t = 0; t < 16; t++) W[t] = M[i][t];

    for (var t = 16; t < 80; t++) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var t = 0; t < 80; t++) {
      var s = Math.floor(t / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

var _default = sha1;
exports.default = _default;
module.exports = exports.default;
},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _bytesToUuid = _interopRequireDefault(require("./bytesToUuid.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : (0, _bytesToUuid.default)(b);
}

var _default = v1;
exports.default = _default;
module.exports = exports.default;
},{"./bytesToUuid.js":21,"./rng.js":24}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _md = _interopRequireDefault(require("./md5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;
module.exports = exports.default;
},{"./md5.js":23,"./v35.js":28}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.URL = exports.DNS = void 0;

var _bytesToUuid = _interopRequireDefault(require("./bytesToUuid.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function uuidToBytes(uuid) {
  // Note: We assume we're being passed a valid uuid string
  var bytes = [];
  uuid.replace(/[a-fA-F0-9]{2}/g, function (hex) {
    bytes.push(parseInt(hex, 16));
  });
  return bytes;
}

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = new Array(str.length);

  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  var generateUUID = function (value, namespace, buf, offset) {
    var off = buf && offset || 0;
    if (typeof value == 'string') value = stringToBytes(value);
    if (typeof namespace == 'string') namespace = uuidToBytes(namespace);
    if (!Array.isArray(value)) throw TypeError('value must be an array of bytes');
    if (!Array.isArray(namespace) || namespace.length !== 16) throw TypeError('namespace must be uuid string or an Array of 16 byte values'); // Per 4.3

    var bytes = hashfunc(namespace.concat(value));
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      for (var idx = 0; idx < 16; ++idx) {
        buf[off + idx] = bytes[idx];
      }
    }

    return buf || (0, _bytesToUuid.default)(bytes);
  }; // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name;
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
},{"./bytesToUuid.js":21}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _bytesToUuid = _interopRequireDefault(require("./bytesToUuid.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof options == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }

  options = options || {};

  var rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || (0, _bytesToUuid.default)(rnds);
}

var _default = v4;
exports.default = _default;
module.exports = exports.default;
},{"./bytesToUuid.js":21,"./rng.js":24}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _sha = _interopRequireDefault(require("./sha1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;
module.exports = exports.default;
},{"./sha1.js":25,"./v35.js":28}]},{},[6]);
