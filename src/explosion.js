import Vector from "./vector.js";
import * as Const from "./const.js";

let PARTS;

class Particle {
  constructor() {
    this.size = new Vector();
    this.grow = new Vector();
    this.pos = new Vector();
    this.vel = new Vector();
    this.velD = new Vector();
    this.alpha = 1;
    this.alive = false;
    this.idx;
  }

  update(dt) {
    if ((this.alpha -= dt) < 0) {
      this.alive = false;
      return;
    }

    this.size.x += this.grow.x * dt;
    this.size.y += this.grow.y * dt;

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    this.vel.x -= this.velD.x * dt;
    this.vel.y -= this.velD.y * dt;
  }

  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(PARTS[this.idx], this.pos.x - (this.size.x >> 1), this.pos.y - (this.size.y >> 1), this.size.x, this.size.y);
  }
}

class Particles {
  constructor() {
    this.particles = [];
    for (let d = 0; d < 1500; d++) {
      this.particles.push(new Particle());
    }
  }

  start(x = 0, y = 0, vx = 0, vy = 0, gx = 0, gy = 0, sx = 1, sy = 1, idx = 0, vdx = 0, vdy = 0) {
    for (let d = 0, len = this.particles.length; d < len; d++) {
      const p = this.particles[d];
      if (!p.alive) {
        p.alpha = 1;
        p.alive = true;
        p.pos.set(x, y);
        p.vel.set(vx, vy);
        p.velD.set(vdx, vdy);
        p.grow.set(gx, gy);
        p.size.set(sx, sy);
        p.idx = idx;
        return;
      }
    }
  }

  update(dt) {
    this.particles.forEach(el => {
      if (el.alive) el.update(dt);
    });
  }

  draw(ctx) {
    this.particles.forEach(el => {
      if (el.alive) el.draw(ctx);
    });
  }
}

class Explo {
  constructor() {
    this.pos = new Vector();
    this.time;
    this.next;
  }
}

export default class Explosion {
  constructor(img) {
    PARTS = Array.from(Object.values(img));
    this.particles = new Particles();
    this.explo = [];
    for (let r = 0; r < 100; r++) {
      this.explo.push(new Explo());
    }
  }

  startParts(x, y) {
    for (let a = 0; a < 30; a++) {
      const q = Math.random() * Const.TWO_PI,
        vx = Math.random() * 20 + 15,
        s = Math.random() * 4 + 2;
      this.particles.start(x, y, vx * Math.cos(q), vx * Math.sin(q), 20, 20, s, s, 0);
    }

    for (let a = 0; a < 50; a++) {
      const q = Math.random() * Const.TWO_PI,
        vx = Math.random() * 50 + 25,
        s = Math.random() * 3 + 2;
      this.particles.start(x, y, vx * Math.cos(q), vx * Math.sin(q), 1, 1, s, s, 0);
    }
  }

  startExplosion(x = 0, y = 0, tm = 0) {
    for (let a = 0; a < 50; a++) {
      const q = Math.random() * Const.TWO_PI,
        vx = Math.random() * 50 + 25,
        s = Math.random() * 3 + 2;
      this.particles.start(x, y, vx * Math.cos(q), vx * Math.sin(q), 1, 1, s, s, 1);
    }

    for (let d = 0, len = this.explo.length; d < len; d++) {
      const p = this.explo[d];
      if (!p.alive) {
        p.alive = true;
        p.next = 0;
        p.pos.set(x, y);
        p.time = tm;
        return;
      }
    }
  }

  update(dt) {
    let ret = false;
    this.explo.forEach(el => {
      if (el.alive) {
        ret = true;
        if ((el.next -= dt) < 0) {
          el.next = .03;
          const q = Math.random() * Const.TWO_PI,
            vx = Math.random() * 10 + 10,
            gx = Math.random() * 16 + 4,
            sx = Math.random() * 12 + 4,
            part = Math.floor(Math.random() * PARTS.length);

          this.particles.start(el.pos.x + vx * Math.cos(q), el.pos.y + vx * Math.sin(q), 0, 0, gx, gx, sx, sx, part);
        }
        if ((el.time -= dt) < 0) {
          el.alive = false;
        }
      }
    });

    this.particles.update(dt);
    return ret;
  }

  draw(ctx) {
    this.particles.draw(ctx);
  }
}