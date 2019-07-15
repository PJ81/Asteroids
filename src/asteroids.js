import * as Const from "./const.js";
import Game from "./game.js";
import Input from "./input.js";
import AsteroidManager from "./asteroidManager.js";
import Player from "./player.js";
import Saucer from "./saucer.js";
import Stars from "./stars.js";
import Explosion from "./explosion.js";

class Asteroids extends Game {
    constructor() {
        super();
        this.player;
        this.keyboard;
        this.asteroids;
        this.saucer;
        this.nextWaveTime = this.invisibleTime = 0;
        this.state = Const.PLAYING;
        this.scoreTable = [200, 20, 50, 100, 150];
    }

    load() {
        this.keyboard = new Input((what, kState) => {
            switch (what) {
                case Const.LEFT:
                    this.player.turn(kState ? -1 : 1);
                    break;
                case Const.RIGHT:
                    this.player.turn(kState ? 1 : -1);
                    break;
                case Const.UP:
                    this.player.move(kState);
                    break;
                case Const.HYPER:
                    this.player.pos.set(Math.random() * (Const.WIDTH - 40) + 20, Math.random() * (Const.HEIGHT - 40) + 20);
                    break;
                case Const.SHOOT:
                    this.player.shoot();
                    break;
            }
        });

        this.asteroids = new AsteroidManager({
            p1: this.res.images[Const.AS1],
            p2: this.res.images[Const.AS2],
            p3: this.res.images[Const.AS3],
            p4: this.res.images[Const.AS4]
        });

        this.explosion = new Explosion({
            p1: this.res.images[Const.EXPB],
            p2: this.res.images[Const.EXPO],
            p3: this.res.images[Const.EXPR],
            p4: this.res.images[Const.EXPY]
        });

        this.stars = new Stars();
        this.saucer = new Saucer(this.res.images[Const.SAUCER], this.res.images[Const.BULLET]);
        this.player = new Player(this.res.images[Const.SHIP], this.res.images[Const.FIRE], this.res.images[Const.BULLET]);
    }

    update(dt) {
        switch (this.state) {
            case Const.ENTER_NEXTWAVE:
                if ((this.nextWaveTime -= dt) < 0) {
                    this.nextWaveTime = 0;
                    this.asteroids.resetAsterois();
                    this.state = Const.PLAYING;
                }
                this.player.update(dt);
                break;
            case Const.INVISIBLE:
                if ((this.invisibleTime -= dt) < 0) {
                    this.invisibleTime = 0;
                    this.state = Const.PLAYING;
                }
                this.player.update(dt);
                break;
            case Const.PLAYING:
                this.player.update(dt);
                break
        }
        this.asteroids.update(dt);
        this.saucer.update(dt, this.player.pos);
        this.stars.update(dt);
        this.explosion.update(dt);
    }

    draw() {
        this.stars.draw(this.ctx);
        this.drawHud();
        switch (this.state) {
            case Const.INVISIBLE:
                this.ctx.globalAlpha = .5;
                this.player.draw(this.ctx);
                this.ctx.globalAlpha = 1;
                break;
            case Const.GAMEOVER:
                this.ctx.textAlign = "center";
                this.ctx.font = "80px 'Electrolize'";
                this.ctx.fillStyle = "#4919ff"
                this.ctx.fillText("GAME OVER", Const.WIDTH >> 1, Const.HEIGHT >> 1);
                break;
            case Const.ENTER_NEXTWAVE:
                this.player.draw(this.ctx);
                this.ctx.textAlign = "center";
                this.ctx.font = "60px 'Electrolize'";
                this.ctx.fillStyle = "#4919ff"
                this.ctx.fillText("NEXT WAVE", Const.WIDTH >> 1, Const.HEIGHT >> 1);
                break;
            case Const.PLAYING:
                this.player.draw(this.ctx);
                break
        }

        this.saucer.draw(this.ctx);
        this.asteroids.draw(this.ctx);
        this.explosion.draw(this.ctx);
        this.checkCollision();
    }

    drawHud() {
        this.ctx.textAlign = "left";
        this.ctx.font = "30px 'Electrolize'";
        this.ctx.fillStyle = "#4919ff"
        this.ctx.fillText(("00000" + this.player.score).slice(-6), 8, 30);

        for (let i = 0; i < this.player.lives; i++) {
            this.ctx.drawImage(this.res.images[Const.SHIP], Const.WIDTH - 30 - i * 20, 10)
        }
    }

    checkCollision() {
        if (!this.player.alive || this.state !== Const.PLAYING) return;

        function collided(a, b) {
            return !(((a.b < b.t) || (a.t > b.b) || (a.r < b.l) || (a.l > b.r)));
        }

        let enemies = this.asteroids.asteroids.filter(a => a.alive);
        this.saucer.flying && (() => {
            enemies = enemies.concat(this.saucer)
        })();

        const blts = this.player.bullets.filter(b => b.alive);
        _next: for (let b = 0, len = blts.length; b < len; b++) {
            const blt = blts[b];
            for (let a = 0, len = enemies.length; a < len; a++) {
                const e = enemies[a];
                if (collided(e.box, blt.box)) {
                    e.explode(blt.dir);
                    if (e instanceof Saucer) {
                        this.explosion.startExplosion(e.pos.x, e.pos.y, 2);
                        this.player.score += this.scoreTable[0];
                    } else {
                        this.explosion.startParts(e.pos.x, e.pos.y);
                        this.player.score += this.scoreTable[e.type];
                    }
                    blt.alive = false;
                    break _next;
                }
            }
        }

        enemies = enemies.concat(this.saucer.bullets.filter(s => s.alive));
        for (let a = 0, len = enemies.length; a < len; a++) {
            const e = enemies[a];
            if (collided(e.box, this.player.box)) {
                this.player.explode();
                this.explosion.startExplosion(this.player.pos.x, this.player.pos.y, 2);
                this.saucer.killBullets();
                if (this.player.lives < 0) {
                    this.state = Const.GAMEOVER;
                } else {
                    this.state = Const.INVISIBLE;
                    this.invisibleTime = 5;
                }
                return;
            }
        }

        if (this.asteroids.asteroids.filter(a => a.alive).length < 1) {
            this.state = Const.ENTER_NEXTWAVE;
            this.nextWaveTime = 3;
        }
    }
}

const g = new Asteroids();