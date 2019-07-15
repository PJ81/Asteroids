import * as Const from "./const.js";
import Entity from "./entity.js";
import Bullet from "./bullet.js";

export default class Player extends Entity {
    constructor(img, fire, blt) {
        super(img);
        this.score = 0;
        this.lives = 2;
        this.turnDir = 0;
        this.flying = false;
        this.alive = true;
        this.coolDown = 0;
        this.waitTime = 0;
        this.bullets = [];

        this.pos.set(Const.WIDTH >> 1, Const.HEIGHT >> 1);

        this.bullet = new Entity(blt);
        this.fire = new Entity(fire);

        for (let s = 0; s < 50; s++) {
            const h = new Bullet(null);
            h.vel.set(350, 350);
            h.width = blt.width;
            h.height = blt.height;
            this.bullets.push(h);
        }

        this.turn = (dir) => {
            this.turnDir += dir;
        }

        this.move = (st) => {
            this.flying = st;
        };
    }

    update(dt) {
        this.bullets.filter(s => s.alive).forEach(s => {
            s.pos.x += s.vel.x * s.dir.x * dt;
            s.pos.y += s.vel.y * s.dir.y * dt;

            if (s.pos.x < 0 || s.pos.y < 0 ||
                s.pos.x > Const.WIDTH || s.pos.y > Const.HEIGHT) {
                s.alive = false;
            }
        });

        if (this.waitTime > 0) {
            if ((this.waitTime -= dt) < 0) {
                this.waitTime = 0;
                this.angle = 0;
                this.turnDir = 0
                this.alive = true;
                this.flying = false;
                this.vel.set(0, 0);
                this.pos.set(Const.WIDTH >> 1, Const.HEIGHT >> 1);
            }
            return;
        }

        if (this.coolDown > 0) {
            if ((this.coolDown -= dt) < 0) {
                this.coolDown = 0;
            }
        }

        if ((this.angle += this.turnDir * dt * 2) > Const.TWO_PI) this.angle = 0;
        this.dir.set(Math.sin(this.angle), -Math.cos(this.angle));

        const acc = this.flying ? dt * 150 : -40 * dt;
        this.vel.set(this.vel.x + acc, this.vel.y + acc);
        this.vel.clamp(0, 150);

        this.pos.x += this.vel.x * dt * this.dir.x;
        this.pos.y += this.vel.y * dt * this.dir.y;

        if (this.dir.x > 0 && this.left > Const.WIDTH) {
            this.pos.x = -(this.width >> 1);
        } else if (this.dir.x < 0 && this.right < 0) {
            this.pos.x = Const.WIDTH + (this.width >> 1);
        }

        if (this.dir.y > 0 && this.top > Const.HEIGHT) {
            this.pos.y = -(this.height >> 1);
        } else if (this.dir.y < 0 && this.bottom < 0) {
            this.pos.y = Const.HEIGHT + (this.height >> 1);
        }
    }

    draw(ctx) {
        this.alive && (() => {
            ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(this.angle);
            ctx.drawImage(this.img, -(this.width >> 1), -(this.height >> 1));

            this.flying && ctx.drawImage(this.fire.img, -(this.fire.width >> 1), this.fire.height);

            ctx.restore();
        })();

        this.bullets.filter(s => s.alive).forEach(s => {
            ctx.drawImage(this.bullet.img, s.left, s.top);
        });
    }

    shoot() {
        if (this.coolDown > 0 || !this.alive) return;

        for (let b = 0, len = this.bullets.length; b < len; b++) {
            const s = this.bullets[b];
            if (!s.alive) {
                s.alive = true;
                s.pos.set(this.pos.x, this.pos.y);
                s.dir.set(this.dir.x, this.dir.y);
                this.coolDown = 0.15;
                return;
            }
        }
    }

    explode() {
        this.alive = false;
        this.waitTime = 3;
        this.lives--;
        return this.lives < 0;
    }
}