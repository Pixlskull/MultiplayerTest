import { Vector } from "./index.js";

export class Controls{
    public left: Boolean;
    public right: Boolean;
    public up: Boolean;
    public down: Boolean;
    public mouseDown: boolean;
    public mousePosition: Vector;
    public mouseRadian: number;

    constructor(){
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.mouseDown = false;
        this.mousePosition = new Vector();
        this.mouseRadian = 0;
    }
    public testMethod(){
        return true
    }
    // public static init(){
    //     Controls.left = false;
    //     Controls.right = false;
    //     Controls.up = false;
    //     Controls.down = false;
    //     Controls.mouseX = 0;
    //     Controls.mouseY = 0;
    //     Controls.mouseRadian = 0;
    // }
    // public static emit(){
    //     return {
    //         "left" : Controls.left,
    //         "right" : Controls.right,
    //         "up" : Controls.up,
    //         "down" : Controls.down,
    //         "mouseX" : Controls.mouseX,
    //         "mouseY" : Controls.mouseY,
    //         "mouseRadian" : Controls.mouseRadian,
    //     }
    // }
    
}