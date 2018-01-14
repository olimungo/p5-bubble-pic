import { Bubble } from './bubble';

export class Bubbles {
    public allTargetsReached = false;
    public alpha = 255;

    private showImageDuration = 2000;
    private scaleFactor;
    private smallImage: p5.Image;
    private bubbles: Bubble[] = [];

    constructor(private p: p5, private image: p5.Image) {
        this.setUp();
    }

    draw() {
        let targetsReached = true;

        this.bubbles.forEach(bubble => {
            bubble.alpha = this.alpha;
            bubble.draw();

            targetsReached = targetsReached && bubble.targetReached;
        });

        this.allTargetsReached = targetsReached;
    }

    convertImage() {
        this.scaleFactor = this.p.floor(this.image.width / 70);

        const width = this.image.width / this.scaleFactor;
        const height = this.image.height / this.scaleFactor;
        this.smallImage = this.p.createImage(width, height);

        this.smallImage.copy(this.image, 0, 0, this.image.width, this.image.height, 0, 0, width, height);
        this.smallImage.loadPixels();
    }

    setUp(): Boolean {
        const centerX = (this.p.windowWidth - this.image.width) / 2;
        const centerY = (this.p.windowHeight - this.image.height) / 2;

        this.convertImage();

        for (let x = 0; x < this.smallImage.width; x++) {
            for (let y = 0; y < this.smallImage.height; y++) {
                const color = this.smallImage.get(x, y);
                const radius = this.p.map(this.p.lightness(color), 0, 255, 0, this.scaleFactor);
                const xCorrected = x * this.scaleFactor + centerX;
                const yCorrected = y * this.scaleFactor + centerY;

                let xStart = this.p.random(this.p.windowWidth);
                let yStart = this.p.random(this.p.windowHeight);

                // let v = this.this.p.createVector(xStart, yStart);
                // let center = this.this.p.createVector(this.this.p.windowWidth / 2, this.this.p.windowHeight / 2);
                // let res = p5.Vector.sub(center, v).add(center);
                // xStart = res.x;
                // yStart = res.y;

                let v = this.p.createVector(xStart, yStart);
                let center = this.p.createVector(this.p.windowWidth / 2, this.p.windowHeight / 2);
                let res = p5.Vector.sub(center, v).add(v);
                xStart = res.x;
                yStart = res.y;

                const reverse = this.p.ceil(this.p.random(0, 4));

                switch (reverse) {
                    case 1:
                        xStart *= -1;
                        break;
                    case 2:
                        yStart *= -1;
                        break;
                    case 3:
                        xStart += this.p.windowWidth;
                        break;
                    case 4:
                        yStart += this.p.windowHeight;
                        break;
                }

                const bubble = new Bubble(this.p, xStart, yStart, xCorrected, yCorrected, radius);
                bubble.fillColor = <p5.Color>color;

                this.bubbles.push(bubble);
            }
        }

        return true;
    }
}
