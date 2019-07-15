import * as Const from "./const.js"
import Bullet from "./bullet.js";
import Entity from "./entity.js";

export default class Saucer extends Entity {
    constructor(img, blt) {
        super(img);

        this.bullet = new Entity(blt);

        this.flying;
        this.flyingTimer;
        this.dirTimer;
        this.coolDown;

        this.bullets = [];
        for (let s = 0; s < 50; s++) {
            const h = new Bullet(null);
            h.vel.set(250, 250);
            h.width = blt.width;
            h.height = blt.height;
            this.bullets.push(h);
        }

        this.explode = () => {
            this.reset();
        }

        this.reset();
    }

    update(dt, pPos) {
        this.bullets.filter(s => s.alive).forEach(s => {
            s.pos.x += s.vel.x * s.dir.x * dt;
            s.pos.y += s.vel.y * s.dir.y * dt;

            if (s.pos.x < 0 || s.pos.y < 0 ||
                s.pos.x > Const.WIDTH || s.pos.y > Const.HEIGHT) {
                s.alive = false;
            }
        });

        switch (this.flying) {
            case true:
                if ((this.dirTimer -= dt) < 0) {
                    this.dirTimer = Math.random() * 3 + 1;
                    this.angle = Math.random() * Const.TWO_PI;
                    this.dir.y = Math.sin(this.angle);
                }

                if ((this.coolDown -= dt) < 0) {
                    this.shoot(pPos);
                }

                this.pos.x += this.vel.x * dt * this.dir.x;
                this.pos.y += this.vel.y * dt * this.dir.y;

                if (this.dir.x > 0 && this.left > Const.WIDTH || this.dir.x < 0 && this.right < 0) {
                    this.reset();
                }

                if (this.dir.y > 0 && this.top > Const.HEIGHT) {
                    this.pos.y = -(this.height >> 1);
                } else if (this.dir.y < 0 && this.bottom < 0) {
                    this.pos.y = Const.HEIGHT + (this.height >> 1);
                }

                break;
            case false:
                if ((this.flyingTimer -= dt) < 0) {
                    this.flying = true;
                    this.flyingTimer = 0;
                    this.pos.set(Math.random() > .5 ? Const.WIDTH + (this.width >> 1) : -(this.width >> 1), Math.random() * 100 + 50);
                    this.angle = Math.random() * Const.TWO_PI;
                    this.dir.set(1, Math.sin(this.angle));
                    if (this.pos.x > 0) this.dir.x = -1;
                    this.vel.set(Math.random() * 50 + 50, Math.random() * 50 + 50);
                }
                break;
        }
    }

    draw(ctx) {
        this.flying && ctx.drawImage(this.img, this.left, this.top);
        this.bullets.filter(s => s.alive).forEach(s => {
            ctx.drawImage(this.bullet.img, s.left, s.top);
        });
    }

    shoot(pPos) {
        for (let b = 0, len = this.bullets.length; b < len; b++) {
            const s = this.bullets[b];
            if (!s.alive) {
                s.alive = true;
                this.coolDown = (Math.random() * 25 + 1) / 15;
                s.dir = pPos.sub(this.pos);
                s.dir.normalize();
                s.pos.set(this.pos.x, this.pos.y);
                return;
            }
        }
    }

    reset() {
        this.flying = false;
        this.flyingTimer = Math.random() * 30 + 20;
        this.dirTimer = Math.random() * 3 + 2;
        this.coolDown = (Math.random() * 25 + 1) / 15;
    }

    killBullets() {
        for (let b = 0, len = this.bullets.length; b < len; b++) {
            this.bullets[b].alive = false;
        }
    }
}