import { GameMap, GameObject, Vector, Controls, Bullet, FastBullet, BulletContainer, Weapon } from "../index.js";
import { v4 } from "uuid";

export class Sniper extends Weapon{
    public owner: string;
    public damage: number;
    public cooldown: number;
    public bulletVelocity: number;
    public lastFired: Date;
    public bulletCount: number;
    public bullets: BulletContainer;

    constructor(owner: string, damage: number = 1, cooldown: number = 2000, bulletVelocity: number = 30){
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = bulletVelocity;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
    }

    public fireWeapon(selfPos: Vector, targetDir: Vector): BulletContainer {
        const bullets: any = {};
        const id = v4()
        this.bulletCount += 1;
        this.lastFired = new Date();
        bullets[id] = new FastBullet(selfPos, targetDir, this.owner, 1, this.bulletVelocity)
        return bullets;
    }

}