import { Bubble } from './components/bubble';
import { Bubbles } from './components/bubbles';

var sketch = (p: p5) => {
    const imageFiles = [
        '/assets/maeva1.png',
        '/assets/heart.png',
        '/assets/oli_eye.jpg',
        '/assets/we-love-art.jpg',
        '/assets/maeva_oli.png'
    ];
    const images: p5.Image[] = [];
    let currentImage = -1;
    let image: p5.Image;
    let bubbles: Bubbles;
    let newBubbles: Bubbles;
    let effectOutTriggered = false;

    p.preload = () => {
        imageFiles.forEach(imageFile => images.push(p.loadImage(imageFile)));
    };

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        getNextImage();
        bubbles = newBubbles;

        // p.frameRate(10);
    };

    p.draw = () => {
        p.background(0);

        // p.scale(0.5);
        // p.translate(p.windowWidth / 2, p.windowHeight / 2);

        bubbles.draw();

        if (bubbles.allTargetsReached && !effectOutTriggered) {
            getNextImage();
            bubbles.setEffectOut();
            effectOutTriggered = true;
        }

        if (bubbles.effectOutEnded) {
            console.log('dddd');
            bubbles = newBubbles;
            effectOutTriggered = false;
        }
    };

    const getNextImage = () => {
        currentImage++;

        if (currentImage === images.length) {
            currentImage = 0;
        }

        newBubbles = new Bubbles(p, images[currentImage]);
    };
};

new p5(sketch);
