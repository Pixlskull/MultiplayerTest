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
//# sourceMappingURL=Controls.js.map