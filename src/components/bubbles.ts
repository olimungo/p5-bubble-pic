import { Bubble } from './bubble';

export class Bubbles {
    public allTargetsReached = false;
    public effectOutEnded = false;
    public alpha = 255;

    private effectOut: Function;
    private effectOutTriggered = false;

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

        if (this.effectOut) {
            this.effectOut();
        }
    }

    convertImage() {
        this.scaleFactor = this.p.floor(this.image.width / 40);

        const width = this.image.width / this.scaleFactor;
        const height = this.image.height / this.scaleFactor;
        this.smallImage = this.p.createImage(width, height);

        this.smallImage.copy(this.image, 0, 0, this.image.width, this.image.height, 0, 0, width, height);
        this.smallImage.loadPixels();
    }

    setUp() {
        const centerX = (this.p.windowWidth - this.image.width) / 2;
        const centerY = (this.p.windowHeight - this.image.height) / 2;
        const vectorMiddle = this.p.createVector(this.p.windowWidth / 2, this.p.windowHeight / 2);
        const randomEffect = this.p.random();

        this.convertImage();

        for (let x = 0; x < this.smallImage.width; x++) {
            for (let y = 0; y < this.smallImage.height; y++) {
                const color = this.smallImage.get(x, y);
                const radius = this.p.map(this.p.lightness(color), 0, 255, 0, this.scaleFactor);
                const xCorrected = x * this.scaleFactor + centerX;
                const yCorrected = y * this.scaleFactor + centerY;

                let vectorStart = this.p.createVector(this.p.random(this.p.windowWidth), this.p.random(this.p.windowHeight));

                if (randomEffect > 0) {
                    vectorStart = this.effectWaveIn(vectorStart, vectorMiddle);
                } else {
                    vectorStart = this.effectRadialIn(vectorStart, vectorMiddle);
                }

                const bubble = new Bubble(this.p, vectorStart.x, vectorStart.y, xCorrected, yCorrected, radius);
                bubble.fillColor = <p5.Color>color;

                this.bubbles.push(bubble);
            }
        }
    }

    effectRadialIn(vector: p5.Vector, vectorMiddle: p5.Vector) {
        const vectorResult = p5.Vector.sub(vector, vectorMiddle);
        const magnitude = this.p.map(this.p.random(), 0, 1, 900, 1300);

        vectorResult.setMag(magnitude);
        vectorResult.add(vectorMiddle);

        return vectorResult;
    }

    effectWaveIn(vector: p5.Vector, vectorMiddle: p5.Vector) {
        const extend = this.p.ceil(this.p.random(0, 4));
        const vectorResult = p5.Vector.sub(vectorMiddle, vector).add(vector);

        switch (extend) {
            case 1:
                vectorResult.x *= -1;
                break;
            case 2:
                vectorResult.y *= -1;
                break;
            case 3:
                vectorResult.x += this.p.windowWidth;
                break;
            case 4:
                vectorResult.y += this.p.windowHeight;
                break;
        }

        return vectorResult;
    }

    setEffectOut() {
        this.effectOut = this.effectExplodeOut;
    }

    effectFadeOut() {
        if (this.alpha > 0) {
            this.alpha = this.alpha - 10;
            this.allTargetsReached = false;
        }

        if (this.allTargetsReached) {
            this.effectOut = null;
            this.effectOutEnded = true;
        }
    }

    effectExplodeOut() {
        if (!this.effectOutTriggered) {
            this.effectOutTriggered = true;
            this.bubbles.forEach(bubble => bubble.explode());
            this.allTargetsReached = false;
        }

        if (this.allTargetsReached) {
            this.effectOut = null;
            this.effectOutEnded = true;
        }
    }
}
