import {
    GameObject, Controls, Vector, GameMap, Weapon, PlayerContainer,
    Player, BulletContainer, Enemy, EnemyType, Gun
} from "./index.js";

export class Zombie extends Enemy {
    public damage: number;
    public id: string;
    public hp: number;
    public agroRadius: number;
    public type: string;
    public weapon: Weapon;

    constructor(position: Vector, id: string) {
        super(position)
        this.radius = 15;
        this.maxVelocity = 3;
        this.hp = 5;
        this.damage = 0;
        this.agroRadius = 300;
        this.type = EnemyType.ZOMBIE;
        this.id = id;
        this.weapon = new Gun(this.id, 1, 1000, 5);
    }
    public ai(players: PlayerContainer): void {
        //returns true if Zombie has a target
        const target: any = players[this.getTarget()];
        if (players.hasOwnProperty(this.getTarget()) && target !== undefined) {
            const targetPos = target.getPosition();
            this.direction = new Vector(targetPos.x - this.position.x, targetPos.y - this.position.y);
            this.normalizeDirection();
        }
        else {
            //idk
        }
    }

    public attack(players: PlayerContainer): BulletContainer {
        const targetVec = players[this.getTarget()].position.clone();
        return this.weapon.fireWeapon(this.position.clone(), targetVec.subtract(this.position));
    }
    public takeDamage(object: GameObject): number {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}