import { GameMap, GameObject, Vector, Controls, Bullet, BulletContainer } from "../index.js";

export enum WeaponType {
    SNIPER = "sniper",
    SWORD = "sword",
}

export abstract class Weapon {
    public owner: string;
    public abstract damage: number;
    public abstract cooldown: number;
    public abstract bulletVelocity: number;
    public abstract lastFired: Date;
    public abstract bulletCount: number;
    public abstract bullets: BulletContainer;

    constructor(owner: string) {
        this.owner = owner;
    }

    abstract fireWeapon(startPos: Vector, targetPos: Vector): BulletContainer;

    public reloadCheck(): boolean {
        const currentTime: Date = new Date();
        if (currentTime.getTime() - this.lastFiredNumber() >= this.cooldown) {
            return true;
        }
        return false;
    }

    public lastFiredNumber(): number {
        return this.lastFired.getTime();
    }

    public getBulletCount(): number {
        return this.bulletCount;
    }
}