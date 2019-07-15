import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(12);

        Promise.all([
            (this.loadImage("./img/ship.png")).then((i) => {
                this.images[Const.SHIP] = i;
            }),
            (this.loadImage("./img/fire.png")).then((i) => {
                this.images[Const.FIRE] = i;
            }),
            (this.loadImage("./img/bullet.png")).then((i) => {
                this.images[Const.BULLET] = i;
            }),
            (this.loadImage("./img/as1.png")).then((i) => {
                this.images[Const.AS1] = i;
            }),
            (this.loadImage("./img/as2.png")).then((i) => {
                this.images[Const.AS2] = i;
            }),
            (this.loadImage("./img/as3.png")).then((i) => {
                this.images[Const.AS3] = i;
            }),
            (this.loadImage("./img/as4.png")).then((i) => {
                this.images[Const.AS4] = i;
            }),
            (this.loadImage("./img/saucer.png")).then((i) => {
                this.images[Const.SAUCER] = i;
            }),
            (this.loadImage("./img/expB.png")).then((i) => {
                this.images[Const.EXPB] = i;
            }),
            (this.loadImage("./img/expO.png")).then((i) => {
                this.images[Const.EXPO] = i;
            }),
            (this.loadImage("./img/expR.png")).then((i) => {
                this.images[Const.EXPR] = i;
            }),
            (this.loadImage("./img/expY.png")).then((i) => {
                this.images[Const.EXPY] = i;
            })
        ]).then(() => {
            cb();
        });
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });
    }

    image(index) {
        if (index < this.images.length) {
            return this.images[index];
        }
        return null;
    }
}