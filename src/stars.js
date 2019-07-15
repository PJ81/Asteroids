import * as Const from "./const.js";

const SHOW = 1,
    HIDE = 2,
    colors = ["#4919ff", "#4317eb", "#3914c8", "#2b0f9b"];

class Star {
    constructor() {
        this.posX;
        this.posY;
        this.alpha;
        this.alphaTime;
        this.velX;
        this.color;
        this.size;
        this.state;
        this.restart();
    }

    restart() {
        this.posX = Math.random() * Const.WIDTH;
        this.posY = Math.random() * Const.HEIGHT;
        this.alpha = 0;
        this.state = SHOW;
        this.size = Math.random() + .8;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.velX = 1 + 5 * Math.random();
        this.alphaTime = Math.random();
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, this.size, this.size);
        ctx.globalAlpha = 1;
    }

    update(dt) {
        switch (this.state) {
            case SHOW:
                if ((this.alpha += dt * this.alphaTime) > 1) {
                    this.state = HIDE;
                    this.alpha = 1;
                }
                break;
            case HIDE:
                if ((this.alpha -= dt * this.alphaTime) < 0) {
                    this.restart();
                }
                if ((this.posX -= dt * this.velX) < 0) {
                    this.restart();
                }
                break;
        }
    }
}

export default class Stars {
    constructor() {
        this.stars = [];
        for (let s = 0; s < 500; s++) {
            const star = new Star();
            this.stars.push(star);
        }
    }

    draw(ctx) {
        this.stars.forEach(el => {
            el.draw(ctx);
        });
    }

    update(dt) {
        this.stars.forEach(el => {
            el.update(dt);
        });
    }
}