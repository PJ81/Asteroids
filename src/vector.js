export default class Vector {
    constructor(x = 0, y = 0) {
        this.x;
        this.y
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
    }

    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }

    equals(vec) {
        return vec.x === this.x && vec.y === this.y;
    }

    normalize() {
        const len = this.len();
        this.x /= len;
        this.y /= len;
    }

    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    rotate(a) {
        const cos = Math.cos(a),
            sin = Math.sin(a);
        this.set(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    clamp(min, max) {
        this.x = Math.min(Math.max(this.x, min), max);
        this.y = Math.min(Math.max(this.y, min), max);
    }
}