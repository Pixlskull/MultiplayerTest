import { Controls, GameMap, Vector, Player } from "./index.js";

class GameClient {
    private static socket: any;
    private static gameLoop: any;
    private static controls: Controls;
    static id: string;
    private static event: any;

    public static init(): void {
        GameMap.init();
        GameClient.controls = new Controls();
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
        }
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
        }
        document.onmousemove = function (e) {
            GameClient.event = e;
            GameClient.controls.mousePosition = GameClient.getMousePos();
        }
        document.onmousedown = function (e) {
            GameClient.controls.mouseDown = true;
        }
        document.onmouseup = function (e) {
            GameClient.controls.mouseDown = false;
        }
        GameClient.socket = io();
        GameClient.socket.on("state", function (data: any) {
            GameClient.debugDraw(data);
        });
        GameClient.socket.on("id", function (socketID: string) {
            GameClient.id = socketID;
        })
        GameClient.gameLoop = setInterval(function () {
            GameClient.socket.emit("userInput", GameClient.controls)
        }, 1000 / 60);
    }
    static draw(data: any): void {
        GameMap.clear();
        let self;
        for (let j in data) {
            //really bad method of checking if the object is a Player
            //Sockets can only emit Json and not the class
            if (data[j].id === GameClient.id && data[j].hasOwnProperty("connected")) {
                self = data[j];
            }
        }
        const centerX = self.position.x - GameMap.getWidth() / 2;
        const centerY = self.position.y - GameMap.getHeight() / 2;
        for (let gameObject in data) {
            const gameObj = data[gameObject];
            const deltaX = gameObj.position.x - centerX;
            const deltaY = gameObj.position.y - centerY
            const cRadius = gameObj.radius
            if (gameObj.type === "fastbullet") {
                const endX = deltaX + gameObj.velocity.x * gameObj.maxVelocity;
                const endY = deltaY + gameObj.velocity.y * gameObj.maxVelocity;
                if (gameObj.isCollided) {
                    GameMap.ctx.beginPath();
                    GameMap.ctx.strokeStyle = "red";
                    GameMap.ctx.moveTo(deltaX, deltaY);
                    GameMap.ctx.lineTo(endX, endY);
                    GameMap.ctx.stroke();
                }
                else {
                    GameMap.ctx.beginPath();
                    GameMap.ctx.strokeStyle = "black";
                    GameMap.ctx.moveTo(deltaX, deltaY);
                    GameMap.ctx.lineTo(endX, endY);
                    GameMap.ctx.stroke();
                }
            }
            else {
                if (gameObj.isCollided) {
                    GameMap.ctx.beginPath();
                    GameMap.ctx.fillStyle = "red";
                    GameMap.ctx.arc(deltaX, deltaY, gameObj.radius, 0, Math.PI * 2, true);
                    GameMap.ctx.fill();
                }
                else {
                    GameMap.ctx.beginPath();
                    GameMap.ctx.strokeStyle = "black";
                    GameMap.ctx.arc(deltaX, deltaY, gameObj.radius, 0, Math.PI * 2);
                    GameMap.ctx.stroke();
                }
            }
        }
        const borderX = GameMap.getWidth() / 2 - self.position.x;
        const borderY = GameMap.getHeight() / 2 - self.position.y;
        GameMap.ctx.strokeStyle = "black";
        GameMap.ctx.rect(borderX, borderY, GameMap.HALF_DIMENSION * 2, GameMap.HALF_DIMENSION * 2);
        GameMap.ctx.stroke();
        GameClient.drawGameBox();
        GameClient.drawStatBox();
        GameClient.drawStats(self);
        GameClient.drawHPBar(self);
    }
    static debugDraw(data: any): void {
        GameMap.clear();
        let self;
        for (let j in data) {
            //really bad method of checking if the object is a Player
            //Sockets can only emit Json and not the class
            if (data[j].id === GameClient.id && data[j].hasOwnProperty("connected")) {
                self = data[j];
            }
        }
        const centerX = self.position.x - GameMap.getWidth() / 2;
        const centerY = self.position.y - GameMap.getHeight() / 2;
        for (let gameObject in data) {
            if (data[gameObject].hasOwnProperty("nw")) {
                GameClient.drawQuadrants(data.quads, GameMap.ctx, self.position.x, self.position.y);
            }
            else if (data[gameObject] !== null){
                const gameObj = data[gameObject];
                const deltaX = gameObj.position.x - centerX;
                const deltaY = gameObj.position.y - centerY
                const cRadius = gameObj.radius
                if (gameObj.type === "fastbullet") {
                    const endX = deltaX + gameObj.velocity.x * gameObj.maxVelocity;
                    const endY = deltaY + gameObj.velocity.y * gameObj.maxVelocity;
                    if (gameObj.isCollided) {
                        GameMap.ctx.beginPath();
                        GameMap.ctx.strokeStyle = "red";
                        GameMap.ctx.moveTo(deltaX, deltaY);
                        GameMap.ctx.lineTo(endX, endY);
                        GameMap.ctx.stroke();
                    }
                    else {
                        GameMap.ctx.beginPath();
                        GameMap.ctx.strokeStyle = "black";
                        GameMap.ctx.moveTo(deltaX, deltaY);
                        GameMap.ctx.lineTo(endX, endY);
                        GameMap.ctx.stroke();
                    }
                }
                else {
                    if (gameObj.isCollided) {
                        GameMap.ctx.beginPath();
                        GameMap.ctx.fillStyle = "red";
                        GameMap.ctx.arc(deltaX, deltaY, gameObj.radius, 0, Math.PI * 2, true);
                        GameMap.ctx.fill();
                    }
                    else {
                        GameMap.ctx.beginPath();
                        GameMap.ctx.strokeStyle = "black";
                        GameMap.ctx.arc(deltaX, deltaY, gameObj.radius, 0, Math.PI * 2);
                        GameMap.ctx.stroke();
                    }
                }
            }
        }
        const borderX = GameMap.getWidth() / 2 - self.position.x;
        const borderY = GameMap.getHeight() / 2 - self.position.y;
        GameMap.ctx.strokeStyle = "black";
        GameMap.ctx.rect(borderX, borderY, GameMap.HALF_DIMENSION * 2, GameMap.HALF_DIMENSION * 2);
        GameMap.ctx.stroke();
        GameClient.drawGameBox();
        GameClient.drawStatBox();
        GameClient.drawStats(self);
        GameClient.drawHPBar(self);
    }
    public static drawGameBox(): void {
        GameMap.ctx.beginPath();
        GameMap.ctx.strokeStyle = "black";
        GameMap.ctx.rect(0, 0, GameMap.getWidth(), GameMap.getHeight());
        GameMap.ctx.stroke();
    }
    public static drawStatBox(): void {
        GameMap.ctx.beginPath();
        GameMap.ctx.clearRect(GameMap.getWidth(), 0, GameMap.UIWidth, GameMap.getHeight())
        GameMap.ctx.strokeStyle = "black";
        GameMap.ctx.rect(GameMap.getWidth(), 0, GameMap.UIWidth, GameMap.getHeight());
        GameMap.ctx.stroke();
    }
    public static drawHPBar(player: any): void {
        GameMap.ctx.beginPath();
        GameMap.ctx.strokeStyle = "black";
        GameMap.ctx.fillStyle = "red";
        GameMap.ctx.rect(GameMap.getWidth() + GameMap.UIWidth / 10, GameMap.getHeight() / 4, GameMap.UIWidth * 0.8, GameMap.getHeight() * 0.025);
        //GameMap.ctx.fillRect(GameMap.getWidth() + GameMap.UIWidth / 10, GameMap.getHeight() / 4, GameMap.UIWidth * 0.8 * (player.hp / player.hpMax), GameMap.getHeight()* 0.025);
        //Fixed code, but the above code looks more funny
        GameMap.ctx.fillRect(GameMap.getWidth() + GameMap.UIWidth / 10, GameMap.getHeight() / 4, GameMap.UIWidth * 0.8 * Math.max(0, (player.hp / player.hpMax)), GameMap.getHeight()* 0.025);
        GameMap.ctx.stroke();
    }
    public static drawStats(player: any): void {
        GameMap.ctx.beginPath();
        GameMap.ctx.font = "14px sans-serif";
        GameMap.ctx.fillStyle = "black";
        GameMap.ctx.textAlign = "left";
        GameMap.ctx.fillText("HP: " + player.hp + " / " + player.hpMax, GameMap.getWidth() + GameMap.UIWidth / 10, GameMap.getHeight() / 4 + GameMap.getHeight() / 10);
        //GameMap.ctx.fillText("Gold: " + player.gold, GameMap.getWidth() + GameMap.UIWidth / 10, GameMap.getHeight() / 4 + GameMap.getHeight() / 7.5);
        GameMap.ctx.font = "10px sans-serif";
    }
    static drawQuadrants(currentQ: any, ctx: CanvasRenderingContext2D, selfX: number, selfY: number) {
        if (currentQ.nw != null) {
            GameClient.drawQuadrants(currentQ.nw, ctx, selfX, selfY);
            GameClient.drawQuadrants(currentQ.ne, ctx, selfX, selfY);
            GameClient.drawQuadrants(currentQ.sw, ctx, selfX, selfY);
            GameClient.drawQuadrants(currentQ.se, ctx, selfX, selfY);
        } else {
            ctx.beginPath();
            ctx.rect(currentQ.boundaryAABB.x - currentQ.boundaryAABB.halfLength + GameMap.getWidth() / 2 - selfX,
                currentQ.boundaryAABB.y - currentQ.boundaryAABB.halfLength + GameMap.getHeight() / 2 - selfY,
                2 * currentQ.boundaryAABB.halfLength, 2 * currentQ.boundaryAABB.halfLength);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';
            ctx.closePath();
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }
    static drawBlockers(): void {
        const cameraAngle = GameClient.getMousePos().getAngle();
        GameMap.ctx.beginPath();
        GameMap.ctx.fillStyle = "black";
        GameMap.ctx.moveTo(300, 300);
        GameMap.ctx.arc(300, 300, 425, cameraAngle + Math.PI * 15 / 180, cameraAngle - Math.PI * 15 / 180);
        GameMap.ctx.closePath();
        GameMap.ctx.fill();
    }
    public static getMousePos(): Vector {
        const rect = GameMap.canvas.getBoundingClientRect();
        if (GameClient.event === undefined) {
            return new Vector(0, 0);
        }
        return new Vector(GameClient.event.clientX - rect.left - GameMap.getWidth() / 2, GameClient.event.clientY - rect.top - GameMap.getHeight() / 2);
    }
}
GameClient.init();
