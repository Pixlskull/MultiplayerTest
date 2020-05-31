import {
    GameObject, Controls, Vector, GameMap, Weapon, PlayerContainer,
    Player, BulletContainer, Enemy, EnemyType, Gun
} from "./index.js";

export class Zombie extends Enemy {
    // public position: Vector;
    // public radius: number
    // public direction: Vector;
    // public maxVelocity: number;
    // public damage: number;
    public id: string;
    public hp: number;
    public agroRadius: number;
    public type: string;
    public weapon: Weapon;
    public target: string;
    public needTarget: boolean;

    constructor(position: Vector, id: string) {
        super(position)
        this.radius = 15;
        this.maxVelocity = 3;
        this.hp = 10;
        this.agroRadius = 300;
        this.type = EnemyType.ZOMBIE;
        this.id = id;
        this.weapon = new Gun(this.id, 1, 1000, 5);
        this.target = null;
        this.needTarget = true;
    }
    public ai(players: PlayerContainer): void {
        //returns true if Zombie has a target
        let target: any = players[this.target];
        if (players.hasOwnProperty(this.target) && target !== undefined) {
            this.direction = new Vector(target.position.x - this.position.x, target.position.y - this.position.y);
            this.normalizeDirection();
        }
        else {
            //idk
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