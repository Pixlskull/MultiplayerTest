import { GameMap, GameObject, Vector, Controls, Bullet, 
    BulletContainer, Weapon, Sniper, SuperWeapon, Sword, ObjectType } from "./index.js";

export class Player extends GameObject {
    public id: string;
    public connected: boolean;
    public cooldown: number;
    public lastFired: Date;
    public hp: number;
    public hpMax: number;
    public type: string;
    public weapon: Weapon;
    //public position: Vector;
    //public objectType: string;

    constructor(position: Vector, id: string) {
        super(position);
        this.id = id;
        this.connected = true;
        this.maxVelocity = 5;
        this.radius = 15;
        this.hp = 10;
        this.hpMax = this.hp;
        //todo: enum
        this.type = "player"
        this.objectType = ObjectType.PLAYER;
        this.weapon = new SuperWeapon(id);
        //this.weapon = new Sword(id);
    }
    public update(): void {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.wallCollision();
    }
    public updateMovement(controls: Controls): void {
        this.direction.reset();
        if (controls.left === true) {
            this.direction.x -= 1;
        }
        if (controls.right === true) {
            this.direction.x += 1;
        }
        if (controls.up === true) {
            this.direction.y -= 1;
        }
        if (controls.down === true) {
            this.direction.y += 1;
        }
        this.normalizeDirection();
    }

    public wallCollision(): void{
        if (this.position.x - this.radius < 0) {
            this.direction.x = 0; 
            this.position.x = 0 + this.radius;
        }
        else if (this.position.x + this.radius > GameMap.HALF_DIMENSION*2) {
            this.direction.x = 0; 
            this.position.x = GameMap.HALF_DIMENSION*2 - this.radius;
        }
        if (this.position.y - this.radius < 0) {
            this.direction.y = 0; 
            this.position.y = 0 + this.radius;
        }
        else if (this.position.y + this.radius > GameMap.HALF_DIMENSION*2) {
            this.direction.y = 0;
            this.position.y = GameMap.HALF_DIMENSION*2 - this.radius;
        }
    }

    public disconnect(): void {
        this.connected = false;
    }

    public reloadCheck(): boolean {
        return this.weapon.reloadCheck();
    }

    public fireWeapon(controls: Controls): BulletContainer {
        return this.weapon.fireWeapon(this.position.clone(), controls.mousePosition);
    }

    public takeDamage(object: GameObject): number {
        this.hp -= object.getDamage();
        this.updateStatus();
        return this.hp;
    }
}