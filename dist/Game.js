"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
class Game {
    static init() {
        //Starts the server
        Game.app = express_1.default();
        Game.http = require("http").Server(Game.app);
        Game.io = socket_io_1.default(Game.http);
        Game.tick = 0;
        Game.app.get("/", (req, res) => {
            res.sendFile(path.resolve("./src/index.html"));
        });
        Game.app.use("/dist", express_1.default.static("dist"));
        Game.io.on("connection", function (socket) {
            Game.newPlayer(socket.id);
            socket.emit("id", socket.id);
            socket.on("userInput", function (controls) {
                Game.updatePlayer(socket.id, controls);
            });
            socket.on("disconnect", function (reason) {
                console.log("disconnect");
                Game.removePlayer(socket.id);
            });
        });
        Game.server = Game.http.listen(Game.port, function () {
            console.log("listening on *:" + Game.port);
        });
        Game.gameInit();
    }
    static gameInit() {
        Game.players = {};
        Game.bullets = {};
        Game.enemies = {};
        Game.boundaryAABB = new index_js_1.AABB(index_js_1.GameMap.HALF_DIMENSION, index_js_1.GameMap.HALF_DIMENSION, index_js_1.GameMap.HALF_DIMENSION);
        Game.lastQuad = null;
        Game.gameLoop = setInterval(function () {
            Game.gameCycle();
            Game.tick += 1;
            if (Game.tick % 1 === 0) {
                //Need to improve this eventually
                let allGameObjects = Object.assign({}, Game.players);
                allGameObjects = Object.keys(allGameObjects).reduce((playerObject, player) => {
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
    static gameCycle() {
        if (Object.keys(Game.enemies).length < 10) {
            Game.createEnemy();
        }
        for (let p in Game.players) {
            Game.players[p].update();
        }
        for (let e in Game.enemies) {
            Game.enemyUpdate(e);
        }
        for (let b in Game.bullets) {
            Game.bullets[b].update();
        }
        Game.collisionUpdate();
        Game.findLiving();
    }
    static removeDisconnectedPlayers() {
        let playerList = {};
        for (let p in Game.players) {
            if (Game.players[p].connected) {
                playerList[p] = Game.players[p];
            }
        }
        Game.players = playerList;
    }
    static findLiving() {
        let newEnemies = {};
        for (let j in Game.enemies) {
            if (Game.enemies[j].isAlive) {
                newEnemies[j] = Game.enemies[j];
            }
        }
        let newBullets = {};
        for (let j in Game.bullets) {
            if (Game.bullets[j].isAlive) {
                newBullets[j] = Game.bullets[j];
            }
        }
        Game.enemies = newEnemies;
        Game.bullets = newBullets;
    }
    static collisionUpdate() {
        const quadTree = new index_js_1.QuadTree(Game.boundaryAABB);
        let combined = Object.assign({}, Game.players);
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
            const cBullet = Game.bullets[b];
            //The source I found this from used +1 for radius, I guess it doesn't hurt to just check a little bit wider
            let searchedAABB = new index_js_1.AABB(cBullet.position.x, cBullet.position.y, cBullet.radius + 1);
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
    static newPlayer(socketID) {
        Game.players[socketID] = new index_js_1.Player(new index_js_1.Vector(index_js_1.GameMap.HALF_DIMENSION, index_js_1.GameMap.HALF_DIMENSION), socketID);
    }
    static removePlayer(socketID) {
        Game.players[socketID].disconnect();
    }
    static updatePlayer(socketID, controls) {
        const player = Game.players[socketID];
        player.updateMovement(controls);
        if (controls.mouseDown && player.weapon.reloadCheck()) {
            Game.createPlayerBullet(socketID, controls);
        }
    }
    static enemyUpdate(enemy) {
        let currEnemy = Game.enemies[enemy];
        currEnemy.update(Game.players);
        if (currEnemy.weapon.reloadCheck() && currEnemy.targetCheck(Game.players)) {
            Game.createEnemyBullet(enemy);
        }
    }
    static createEnemy() {
        let spawnPoint = Game.findLocation(0, 100);
        if (spawnPoint !== null) {
            const newID = uuid_1.v4();
            Game.enemies[newID] = new index_js_1.Zombie(spawnPoint, newID);
            return true;
        }
        return false;
    }
    static findLocation(attemptNum, radius) {
        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        if (attemptNum > 20) {
            return null;
        }
        const testLocation = new index_js_1.Vector(randomInt(radius, index_js_1.GameMap.HALF_DIMENSION * 2 - radius), randomInt(radius, index_js_1.GameMap.HALF_DIMENSION * 2 - radius));
        let goodLocation = true;
        for (let p in Game.players) {
            if (testLocation.distance(Game.players[p]) < 60) {
                goodLocation = false;
                break;
            }
        }
        if (goodLocation) {
            return testLocation;
        }
        return Game.findLocation(attemptNum + 1, radius);
    }
    static createPlayerBullet(socketID, controls) {
        //Sketchy method, I don't know if it's flawless
        Game.bullets = Object.assign(Game.bullets, Game.players[socketID].fireWeapon(controls));
        // const newBullets: BulletContainer = Game.players[socketID].fireWeapon(socketID, controls);
        // for (let bullet in newBullets){
        //     Game.bullets[bullet] = newBullets[bullet];
        // }
    }
    static createEnemyBullet(enemy) {
        Game.bullets = Object.assign(Game.bullets, Game.enemies[enemy].attack(Game.players));
    }
}
Game.port = 8080;
Game.frameTime = 1000 / 60;
Game.init();
//# sourceMappingURL=Game.js.map