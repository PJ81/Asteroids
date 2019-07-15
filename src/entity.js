import Vector from "./vector.js";

export default class Entity {
    constructor(img) {
        this.pos = new Vector();
        this.vel = new Vector();
        this.dir = new Vector();
        this.alive = false;
        this.angle = 0;
        this.width;
        this.height;
        this.img;
        this.setImage(img);
    }

    setImage(img) {
        if (img) {
            this.img = img;
            this.width = this.img.width;
            this.height = this.img.height;
        }
    }

    update(dt) {
        //
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.left, this.top);
    }

    get box() {
        const w = this.width * .1,
            h = this.height * .1;
        return {
            l: this.left + w,
            r: this.right - w,
            t: this.top + h,
            b: this.bottom - h
        };
    }

    get left() {
        return this.pos.x - (this.width >> 1);
    }

    get right() {
        return this.pos.x + (this.width >> 1);
    }

    get top() {
        return this.pos.y - (this.height >> 1);
    }

    get bottom() {
        return this.pos.y + (this.height >> 1);
    }
}