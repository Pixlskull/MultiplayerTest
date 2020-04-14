import { GameObject, Controls } from "../src/index.js";

export class GameMap {
    public static canvas: HTMLCanvasElement
    public static ctx: CanvasRenderingContext2D;
    public static UIWidth: number;
    public static readonly HALF_DIMENSION: number = 500;

    public static init(): void {
        GameMap.UIWidth = 200;
        GameMap.canvas = document.querySelector("canvas");
        GameMap.canvas.height = 600;
        GameMap.canvas.width = 600 + GameMap.UIWidth;
        GameMap.ctx = GameMap.canvas.getContext("2d");
    }
    // public static updateWidth(width: number): void {
    //     GameMap.canvas.width = width;
    // }
    public static getWidth(): number {
        return GameMap.canvas.width - GameMap.UIWidth;
    }
    
    public static getCanvasWidth(): number {
        return GameMap.canvas.width;
    }
    // public static updateHeight(height: number): void {
    //     GameMap.canvas.height = height;
    // }
    public static getHeight(): number {
        return GameMap.canvas.height;
    }
    public static clear(): void {
        GameMap.ctx.clearRect(0, 0, GameMap.getCanvasWidth(), GameMap.getHeight());
    }

}