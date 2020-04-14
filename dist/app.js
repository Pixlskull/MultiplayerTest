// import express from "express";
// import socket from "socket.io";
// import * as path from "path";
// import { Game, Controls } from "./index.js"
// //Seperate from Game because Game has some properties that need exporting
// const app: any = express();
// const port: number = 8080;
// const http: any = require("http").Server(app);
// const io: any = socket(http);
// const frameTime: number = 1000/60;
// let tick: number = 0;
// let players: any = {};
// app.get("/", (req: any, res: any) => {
//     res.sendFile(path.resolve("./src/index.html"))
// });
// app.use("/dist", express.static("dist"));
// io.on("connection", function (socket: any) {
// 	Game.newPlayer(socket.id);
// 	socket.emit("id", socket.id);
// 	socket.on("userInput", function (controls: any) {
// 		Game.updatePlayer(socket.id, controls);
// 	});
// 	socket.on("disconnect", function (reason: any) {
// 		console.log("disconnect");
// 		Game.removePlayer(socket.id);
// 	})
// });
// const server = http.listen(port, function () {
// 	console.log("listening on *:" + port);
// });
// Game.init();
// Game.gameLoop = setInterval(function () {
// 	Game.gameCycle();
// 	tick+=1;
// 	if (tick % 1 === 0){
// 		//console.log("frame");
// 		players = {}
// 		players = Object.assign(players, Game.players);
// 		players = Object.keys(players).reduce((playerObject: any, player: any) => {
// 		let currentPlayer = players[player];
// 			if (currentPlayer.connected === true) {
// 				playerObject[player] = currentPlayer;
// 			}
// 			return playerObject;
// 		}, {});
// 		players = Object.assign(players, Game.bullets);
// 		players.quads = Game.lastQuad;
// 		io.sockets.emit("state", players);
// 	}
// 	if (tick === 60){
// 		Game.removeDisconnectedPlayers();
// 		tick = 0;
// 	}
// }, frameTime);
//# sourceMappingURL=app.js.map