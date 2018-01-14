import { Bubble } from './components/bubble';
import { Bubbles } from './components/bubbles';

var sketch = (p: p5) => {
    const imageFiles = [
        '/assets/heart.png',
        '/assets/maeva1.png',
        '/assets/oli_eye.jpg',
        '/assets/we-love-art.jpg',
        '/assets/maeva_oli.png'
    ];
    const images: p5.Image[] = [];
    let currentImage = -1;
    let image: p5.Image;
    let bubbles: Bubbles;
    let newBubbles: Bubbles;
    let alpha = 255;

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
        bubbles.alpha = alpha;
        bubbles.draw();

        if (bubbles.allTargetsReached) {
            if (alpha === 255) {
                getNextImage();
            }

            fadeImage();
        }
    };

    const getNextImage = () => {
        currentImage++;

        if (currentImage === images.length) {
            currentImage = 0;
        }

        newBubbles = new Bubbles(p, images[currentImage]);
    };

    const fadeImage = () => {
        alpha -= 10;

        if (alpha <= 0) {
            bubbles = newBubbles;
            alpha = 255;
        }
    };
};

new p5(sketch);
