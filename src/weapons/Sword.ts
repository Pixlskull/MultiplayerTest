import { GameMap, GameObject, Vector, Controls, Bullet, LineBullet, BulletContainer, Weapon } from "../index.js";
import { v4 } from "uuid";

export class Sword extends Weapon{
    public owner: string;
    public damage: number;
    public cooldown: number;
    public bulletVelocity: number;
    public lastFired: Date;
    public bulletCount: number;
    public bullets: BulletContainer;
    public rightSide: boolean;

    constructor(owner: string, damage: number = 2, cooldown: number = 250, velocity: number = 30){
        super(owner);
        this.damage = damage;
        this.cooldown = cooldown;
        this.bulletVelocity = 30;
        this.lastFired = new Date();
        this.bulletCount = 0;
        this.bullets = {};
        this.rightSide = true;
    }

    public fireWeapon(selfPos: Vector, targetDir: Vector): BulletContainer {
        //targetDir is a non-unit vector that is the aim relative to the user
        //targetPos is that coordinate but in absolute units, not relative to the user
        //shiftedPos is offset from the user, makes shots come in slightly from the side
        //modfiedTargetDir is non-unit aim relative to the bullet
        const bullets: any = {};
        const id: string = v4()
        const targetPos: Vector = selfPos.clone().add(targetDir);
        this.bulletCount += 1;
        this.lastFired = new Date();
        const shiftedPos: Vector = this.rightSide ? selfPos.add(targetDir.cPerpRotation().scaleTo(50)) 
        : selfPos.add(targetDir.cCPerpRotation().scaleTo(50));

        let modifiedTargetDir: Vector = targetPos.clone().subtract(shiftedPos);
        bullets[id] = new LineBullet(shiftedPos, 
        modifiedTargetDir, this.owner, 1, 10, 30);
        this.rightSide = !this.rightSide;
        return bullets;
    }

}