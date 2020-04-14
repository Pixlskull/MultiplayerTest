import { GameObject, Controls, Vector, GameMap, Weapon, PlayerContainer, 
    Player, BulletContainer, Enemy, EnemyType, Sniper } from "./index.js";

export class Zombie extends Enemy {
    public position: Vector;
    public radius: number
    public velocity: Vector;
    public maxVelocity: number;
    public id: string;
    public hp: number;
    public type: string;
    public weapon: Weapon;
    public damage: number;
    public target: string;

    constructor(position: Vector, id: string) {
        super(position)
        console.log(this.position);
        this.radius = 10;
        this.maxVelocity = 3;
        this.hp = 10;
        this.type = EnemyType.ZOMBIE;
        this.id = id;
        this.weapon = new Sniper(this.id, 1, 1000, 5);
        this.target = null;
    }
    public reloadCheck(): boolean {
        return this.weapon.reloadCheck();
    }
    public ai(players: PlayerContainer): void {
        if (players.hasOwnProperty(this.target)){
            let target: any = players[this.target];
            if (players[this.target] !== undefined){
                this.velocity = new Vector(target.position.x - this.position.x, target.position.y - this.position.y);
                this.normalizeVelocity();
            }
            //I don't feel like typing out players[this.target];
            else {
                this.findTarget(players);
            }
        }
        else {
            this.findTarget(players);
        }
    }

    public targetCheck(players: PlayerContainer): boolean {
        return (players.hasOwnProperty(this.target) && players[this.target] !== undefined);
    }
    public findTarget(players: PlayerContainer): void {
        let smallestValue: number = Number.POSITIVE_INFINITY;
        let currentP: string = null;
        for (let p in players){
            if (this.getDistance(players[p]) < smallestValue){
                currentP = p;
            }
        }
        if (currentP !== null) {
            this.target = currentP;
        }
    }

    public attack(players: PlayerContainer): BulletContainer {
        let targetVec = players[this.target].position.clone();
        return this.weapon.fireWeapon(this.position.clone(), targetVec.subtract(this.position));
    }
    public takeDamage(object: GameObject): number {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}