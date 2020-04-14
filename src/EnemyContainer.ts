import { Enemy } from "./index.js";

export interface EnemyContainer{
    [index: string]: Enemy;
}