import * as Const from "./const.js"
import Entity from "./entity.js"

class Asteroid extends Entity {
    constructor(img, type) {
        super(img);
        this.type = type;
        this.turnSpeed;
        this.dead = false;

        this.explode = (dir) => {
            this.dead = true;
            this.dir.set(dir.x, dir.y)
        };
    }
}
export default class AsteroidManager {
    constructor(images) {
        this.images = [];
        this.images[Const.BIG] = images.p1;
        this.images[Const.MED] = images.p2;
        this.images[Const.SML] = images.p3;
        this.images[Const.LIL] = images.p4;

        this.asteroids = [];
        for (let a = 0; a < Const.ACOUNT; a++) {
            const na = new Asteroid(null, Const.BIG);
            na.width = images.p1.width;
            na.height = images.p1.height;
            na.angle = Math.random() * Const.TWO_PI;
            na.vel.set(30, 30);
            na.turnSpeed = .5;
            this.asteroids.push(na);
        }

        for (let a = 0; a < Const.ACOUNT * 2; a++) {
            const na = new Asteroid(null, Const.MED);
            na.width = images.p2.width;
            na.height = images.p2.height;
            na.angle = Math.random() * Const.TWO_PI;
            na.vel.set(60, 60);
            na.turnSpeed = .75;
            this.asteroids.push(na);
        }

        for (let a = 0; a < Const.ACOUNT * 2 * 2; a++) {
            const na = new Asteroid(null, Const.SML);
            na.width = images.p3.width;
            na.height = images.p3.height;
            na.angle = Math.random() * Const.TWO_PI;
            na.vel.set(120, 120);
            na.turnSpeed = 1.3;
            this.asteroids.push(na);
        }

        for (let a = 0; a < Const.ACOUNT * 2 * 2 * 2; a++) {
            const na = new Asteroid(null, Const.LIL);
            na.width = images.p4.width;
            na.height = images.p4.height;
            na.angle = Math.random() * Const.TWO_PI;
            na.vel.set(220, 220);
            na.turnSpeed = 1.9;
            this.asteroids.push(na);
        }

        this.resetAsterois();
    }

    update(dt) {
        this.asteroids.filter(a => a.alive).forEach(s => {
            if (s.dead) {
                this.splitAsteroid(s);
            } else {
                if ((s.angle += s.turnSpeed * dt) > Const.TWO_PI) s.angle = 0;

                s.pos.x += (s.vel.x * dt) * s.dir.x;
                s.pos.y += (s.vel.y * dt) * s.dir.y;

                if (s.dir.x > 0 && s.left > Const.WIDTH) {
                    s.pos.x = -(s.width >> 1);
                } else if (s.dir.x < 0 && s.right < 0) {
                    s.pos.x = Const.WIDTH + (s.width >> 1);
                }

                if (s.dir.y > 0 && s.top > Const.HEIGHT) {
                    s.pos.y = -(s.height >> 1);
                } else if (s.dir.y < 0 && s.bottom < 0) {
                    s.pos.y = Const.HEIGHT + (s.height >> 1);
                }
            }
        });
    }

    draw(ctx) {
        this.asteroids.filter(a => a.alive).forEach(s => {
            ctx.save();
            ctx.translate(s.pos.x, s.pos.y);
            ctx.rotate(s.angle);
            ctx.drawImage(this.images[s.type], -(s.width >> 1), -(s.height >> 1));
            ctx.restore();
        });
    }

    resetAsterois() {
        for (let a = 0; a < Const.ACOUNT; a++) {
            const na = this.asteroids[a];
            const g = Math.random() * Const.TWO_PI;
            na.pos.set(450 - Math.cos(g) * 350, 335 - Math.sin(g) * 350);
            na.dir.set(Math.cos(na.angle), Math.sin(na.angle));
            na.alive = true;
        }
    }

    splitAsteroid(a) {
        a.alive = a.dead = false;
        if (a.type < Const.LIL) {
            for (let b = 0; b < 2; b++) {
                const c = this.asteroids.filter(x => (!x.alive && x.type === (a.type + 1)))[0];
                if (!c) continue;
                c.alive = true;
                c.pos.set(a.pos.x, a.pos.y);
                c.dir.set(a.dir.x, a.dir.y)
                if (b) {
                    c.dir.rotate(-Math.PI * .5);
                    c.pos.x += c.dir.x * c.width * .25;
                    c.pos.y += c.dir.y * c.height * .25;
                    c.dir.rotate(Math.PI * .25)

                } else {
                    c.dir.rotate(Math.PI * .5);
                    c.pos.x += c.dir.x * c.width * .25;
                    c.pos.y += c.dir.y * c.height * .25;
                    c.dir.rotate(-Math.PI * .25)
                }
            }
        }
    }
}