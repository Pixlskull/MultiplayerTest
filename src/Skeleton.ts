import { GameObject, Controls, Vector, GameMap, Weapon, PlayerContainer, 
    Player, BulletContainer, Enemy, EnemyType, Gun } from "./index.js";

export class Skeleton extends Enemy {
    public position: Vector;
    public radius: number
    public direction: Vector;
    public maxVelocity: number;
    public id: string;
    public hp: number;
    public agroRadius: number;
    public firingRange: number;
    public type: string;
    public weapon: Weapon;
    public damage: number;

    constructor(position: Vector, id: string) {
        super(position)
        this.radius = 15;
        this.maxVelocity = 3;
        this.hp = 5;
        this.damage = 0;
        this.agroRadius = 500;
        this.firingRange = 200;
        this.type = EnemyType.SKELETON;
        this.id = id;
        this.weapon = new Gun(this.id, 1, 1000, 5);
    }
    public reloadCheck(): boolean {
        return this.weapon.reloadCheck();
    }
    public ai(players: PlayerContainer): void {
        //returns true if Zombie has a target

        let target: any = players[this.getTarget()];
        if (players.hasOwnProperty(this.getTarget()) && target !== undefined) {
            if (this.getDistance(target) > 200){
                this.direction = new Vector(target.position.x - this.position.x, target.position.y - this.position.y);
                this.normalizeDirection();
            }
            else {
                this.direction = new Vector(0,0);
            }
        }
        else {
            //idk
        }
    }

    public attack(players: PlayerContainer): BulletContainer {
        let targetVec = players[this.getTarget()].position.clone();
        return this.weapon.fireWeapon(this.position.clone(), targetVec.subtract(this.position));
    }
    public takeDamage(object: GameObject): number {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}