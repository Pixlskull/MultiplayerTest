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
                const endX = deltaX + gameObj.velocity.x * gameObj.maxVelocity;
                const endY = deltaY + gameObj.velocity.y * gameObj.maxVelocity;
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
                if (gameObj.type === "fastbullet") {
                    const endX = deltaX + gameObj.velocity.x * gameObj.maxVelocity;
                    const endY = deltaY + gameObj.velocity.y * gameObj.maxVelocity;
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
//# sourceMappingURL=GameClient.js.map