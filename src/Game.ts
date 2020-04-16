import {
    GameObject, GameMap, Controls, Player, Bullet, Vector, Enemy, Zombie,
    PlayerContainer, BulletContainer, EnemyContainer, AABB, QuadTree, FastBullet
} from "./index.js";
import express from "express";
import socket from "socket.io";
import * as path from "path";
import { v4 } from "uuid";

class Game {
    public static gameLoop: any;
    public static players: PlayerContainer;
    public static enemies: EnemyContainer;
    public static bullets: BulletContainer;
    public static boundaryAABB: AABB;
    public static lastQuad: QuadTree;
    public static app: any;
    public static readonly port: number = 8080;
    public static http: any;
    public static io: any;
    public static readonly frameTime: number = 1000 / 60;
    public static tick: number;
    public static server: any;

    public static init(): void {
        //Starts the server
        Game.app = express();
        Game.http = require("http").Server(Game.app);
        Game.io = socket(Game.http);
        Game.tick = 0;
        Game.app.get("/", (req: any, res: any) => {
            res.sendFile(path.resolve("./src/index.html"))
        });
        Game.app.use("/dist", express.static("dist"));
        Game.io.on("connection", function (socket: any) {
            Game.newPlayer(socket.id);
            socket.emit("id", socket.id);
            socket.on("userInput", function (controls: any) {
                Game.updatePlayer(socket.id, controls);
            });
            socket.on("disconnect", function (reason: any) {
                console.log("disconnect");
                Game.removePlayer(socket.id);
            })
        });
        Game.server = Game.http.listen(Game.port, function () {
            console.log("listening on *:" + Game.port);
        });
        Game.gameInit();
    }
    public static gameInit(): void {
        Game.players = {};
        Game.bullets = {};
        Game.enemies = {};
        Game.boundaryAABB = new AABB(GameMap.HALF_DIMENSION, GameMap.HALF_DIMENSION, GameMap.HALF_DIMENSION);
        Game.lastQuad = null;

        Game.gameLoop = setInterval(function () {
            Game.gameCycle();
            Game.tick += 1;
            if (Game.tick % 1 === 0) {
                //Need to improve this eventually
                let allGameObjects: any = Object.assign({}, Game.players);
                allGameObjects = Object.keys(allGameObjects).reduce((playerObject: any, player: any) => {
                    let currentPlayer = allGameObjects[player];
                    if (currentPlayer.connected === true) {
                        playerObject[player] = currentPlayer;
                    }
                    return playerObject;
                }, {});
                allGameObjects = Object.assign(allGameObjects, Game.bullets);
                allGameObjects = Object.assign(allGameObjects, Game.enemies);
                allGameObjects.quads = Game.lastQuad;
                Game.io.sockets.emit("state", allGameObjects);
            }
            if (Game.tick === 60) {
                Game.removeDisconnectedPlayers();
                Game.tick = 0;
            }
        }, Game.frameTime);
    }
    public static gameCycle(): void {
        if (Object.keys(Game.enemies).length < 10) {
            Game.createEnemy();
        }
        for (let p in Game.players) {
            Game.players[p].update();
        }
        for (let e in Game.enemies) {
            Game.enemyUpdate(e)
        }
        for (let b in Game.bullets) {
            Game.bullets[b].update();
        }
        Game.collisionUpdate();
        Game.findLiving();
    }
    public static removeDisconnectedPlayers(): void {
        let playerList: PlayerContainer = {};
        for (let p in Game.players) {
            if (Game.players[p].connected) {
                playerList[p] = Game.players[p];
            }
        }
        Game.players = playerList;
    }
    public static findLiving(): void {
        let newEnemies: EnemyContainer = {};
        for (let j in Game.enemies) {
            if (Game.enemies[j].isAlive) {
                newEnemies[j] = Game.enemies[j];
            }
        }
        let newBullets: BulletContainer = {};
        for (let j in Game.bullets) {
            if (Game.bullets[j].isAlive) {
                newBullets[j] = Game.bullets[j];
            }
        }
        Game.enemies = newEnemies;
        Game.bullets = newBullets;
    }
    public static collisionUpdate(): void {
        const quadTree: QuadTree = new QuadTree(Game.boundaryAABB);

        let combined: any = Object.assign({}, Game.players);
        combined = Object.assign(combined, Game.enemies);
        for (let p in combined) {
            combined[p].isCollided = false;
            quadTree.insert(combined[p]);
        }
        for (let b in Game.bullets) {
            Game.bullets[b].isCollided = false;
            quadTree.insert(Game.bullets[b]);
        }
        for (let b in Game.bullets) {
            const cBullet = Game.bullets[b]
            //The source I found this from used +1 for radius, I guess it doesn't hurt to just check a little bit wider
            let searchedAABB = new AABB(cBullet.position.x, cBullet.position.y, cBullet.radius + 1);
            let foundObjects = quadTree.queryRange(searchedAABB);
            for (let p in combined) {
                const cObject = combined[p];
                if (cBullet.collisionCheck(cObject)) {
                    //do something
                    if (cBullet.factionCheck(cObject)) {
                        cBullet.isCollided = true;
                        cObject.isCollided = true;
                        cBullet.takeDamage(cObject);
                        cObject.takeDamage(cBullet);
                    }

                }
            }
        }
        Game.lastQuad = quadTree;
    }
    public static newPlayer(socketID: string): void {
        Game.players[socketID] = new Player(new Vector(GameMap.HALF_DIMENSION, GameMap.HALF_DIMENSION), socketID);
    }

    public static removePlayer(socketID: string): void {
        Game.players[socketID].disconnect();
    }

    public static updatePlayer(socketID: string, controls: Controls): void {
        const player = Game.players[socketID];
        player.updateMovement(controls);
        if (controls.mouseDown && player.weapon.reloadCheck()) {
            Game.createPlayerBullet(socketID, controls);
        }
    }

    public static enemyUpdate(enemy: string): void {
        let currEnemy: Enemy = Game.enemies[enemy];
        currEnemy.update(Game.players);
        if (currEnemy.weapon.reloadCheck() && currEnemy.targetCheck(Game.players)){
            Game.createEnemyBullet(enemy);
        }
    }

    public static createEnemy(): boolean {
        let spawnPoint: any = Game.findLocation(0, 100);
        if (spawnPoint !== null) {
            const newID: string = v4();
            Game.enemies[newID] = new Zombie(spawnPoint, newID);
            return true;
        }
        return false;
    }

    public static findLocation(attemptNum: number, radius: number): any {
        function randomInt(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        if (attemptNum > 20) {
            return null
        }

        const testLocation: Vector = new Vector(
            randomInt(radius, GameMap.HALF_DIMENSION*2 - radius),
            randomInt(radius, GameMap.HALF_DIMENSION*2 - radius)
        );

        let goodLocation: boolean = true;
        for (let p in Game.players) {
            if (testLocation.distance(Game.players[p]) < 60) {
                goodLocation = false;
                break;
            }
        }
        if (goodLocation) {
            return testLocation
        }

        return Game.findLocation(attemptNum + 1, radius);
    }
    public static createPlayerBullet(socketID: string, controls: Controls): void {
        //Sketchy method, I don't know if it's flawless
        Game.bullets = Object.assign(Game.bullets, Game.players[socketID].fireWeapon(controls));

        // const newBullets: BulletContainer = Game.players[socketID].fireWeapon(socketID, controls);
        // for (let bullet in newBullets){
        //     Game.bullets[bullet] = newBullets[bullet];
        // }
    }

    public static createEnemyBullet(enemy: string): void {
        Game.bullets = Object.assign(Game.bullets, Game.enemies[enemy].attack(Game.players));
    }
}
Game.init();