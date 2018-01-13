import { Bubble } from './bubble';

export class Bubbles {
    private scaleFactor = 13;
    private bubbles: Bubble[] = [];

    constructor(private p: p5, image: p5.Image) {
        const width = p.floor(image.width / this.scaleFactor);
        const height = p.floor(image.height / this.scaleFactor);
        const smallImage = p.createImage(width, height);
        const centerX = (p.windowWidth - image.width) / 2;
        const centerY = (p.windowHeight - image.height) / 2;

        smallImage.copy(image, 0, 0, image.width, image.height, 0, 0, width, height);
        smallImage.loadPixels();

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const color = smallImage.get(x, y);
                const radius = p.map(p.lightness(color), 0, 255, this.scaleFactor / 10, this.scaleFactor) * 2;
                const xCorrected = x * this.scaleFactor + centerX;
                const yCorrected = y * this.scaleFactor + centerY;

                let xStart = p.random(p.windowWidth);
                let yStart = p.random(p.windowHeight);

                // let v = this.p.createVector(xStart, yStart);
                // let center = this.p.createVector(this.p.windowWidth / 2, this.p.windowHeight / 2);
                // let res = p5.Vector.sub(v, center).setMag(2);
                // xStart = res.x;
                // yStart = res.y;

                const reverse = this.p.ceil(this.p.random(0, 4));

                switch (reverse) {
                    case 1:
                        xStart *= -1;
                        break;
                    case 2:
                        yStart *= -1;
                        break;
                    case 3:
                        xStart += p.windowWidth;
                        break;
                    case 4:
                        yStart += p.windowHeight;
                        break;
                }

                const bubble = new Bubble(p, xStart, yStart, xCorrected, yCorrected, radius);

                this.bubbles.push(bubble);
            }
        }
    }

    draw() {
        this.bubbles.forEach(bubble => {
            bubble.draw();
        });
    }
}
