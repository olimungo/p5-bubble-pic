import { Bubble } from './components/bubble';
import { Bubbles } from './components/bubbles';

var sketch = function(p: p5) {
    let image: p5.Image;
    let bubbles: Bubbles;

    p.preload = () => {
        image = p.loadImage('/assets/maeva1.png');
    };

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        bubbles = new Bubbles(p, image);
        // p.frameRate(10);
    };

    p.draw = () => {
        p.background(0);
        bubbles.draw();
    };
};

new p5(sketch);
