import { Player } from "./index.js";

export interface PlayerContainer{
    [index: string]: Player;
}