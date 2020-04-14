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
//# sourceMappingURL=GameMap.js.map