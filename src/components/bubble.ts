export class Bubble {
    public targetReached = false;
    public alpha = 255;
    public fillColor: p5.Color;

    private originalLocation: p5.Vector;
    private location: p5.Vector;
    private target: p5.Vector;
    private velocity: p5.Vector;
    private acceleration: p5.Vector;
    private maxSpeed = 9;
    private maxForce = 4;
    private mediumSpeed = 3;
    private mediumForce = 2;
    private slowDownDistance = 100;
    private mouseInfluenceDistance = 75;
    private effectOutTriggered = false;

    constructor(private p: p5, xStart: number, yStart: number, xTarget: number, yTarget: number, private radius: number) {
        this.originalLocation = p.createVector(xStart, yStart);
        this.location = p.createVector(xStart, yStart);
        this.target = p.createVector(xTarget, yTarget);
        this.velocity = p5.Vector.random2D();
        this.acceleration = p.createVector();
    }

    draw() {
        if (!this.targetReached) {
            this.update();
        }

        if (this.radius > 0) {
            this.p.push();
            const color = this.p.color(this.fillColor[0], this.fillColor[1], this.fillColor[2], this.alpha);
            this.p.fill(color);
            this.p.noStroke();
            this.p.ellipse(this.location.x, this.location.y, this.radius * 2.5, this.radius * 2.5);
            this.p.pop();
        }
    }

    behaviors() {
        const join = this.joinTarget(this.target);
        this.applyForce(join);

        // const mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
        // const escape = this.escapeTargetFromMinimalDistance(mouse);
        // this.applyForce(escape);
    }

    joinTarget(target: p5.Vector) {
        const desired = p5.Vector.sub(target, this.location);
        const distance = desired.mag();
        let speed = this.maxSpeed;
        let force = this.maxForce;

        if (distance < this.slowDownDistance) {
            force = this.mediumForce;
            speed = this.p.map(distance, 0, 100, 0, this.mediumSpeed);
        }

        desired.setMag(speed);
        const steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(force);

        return steer;
    }

    seekTarget(target: p5.Vector) {
        const desired = p5.Vector.sub(target, this.location);
        desired.setMag(this.maxSpeed);
        const steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);

        return steer;
    }

    escapeTarget(target: p5.Vector) {
        const desired = p5.Vector.sub(target, this.location);
        desired.setMag(this.maxSpeed);
        desired.mult(-1);
        const steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);

        return steer;
    }

    escapeTargetFromMinimalDistance(target: p5.Vector) {
        const desired = p5.Vector.sub(target, this.location);
        const distance = desired.mag();

        if (distance < this.mouseInfluenceDistance) {
            desired.setMag(this.maxSpeed);
            desired.mult(-1);
            const steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return this.p.createVector(0, 0);
        }
    }

    applyForce(force: p5.Vector) {
        this.acceleration.add(force);
    }

    update() {
        this.behaviors();

        this.location.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);

        if (this.p.abs(this.location.x - this.target.x) < 0.5 && this.p.abs(this.location.y - this.target.y) < 0.5) {
            this.targetReached = true;
        }
    }

    explode() {
        const randomDelay = this.p.random(0, 100);
        this.targetReached = false;
        this.effectOutTriggered = true;
        this.target = this.originalLocation.copy();
        this.acceleration = p5.Vector.random2D();
        this.maxSpeed = this.p.random(30, 50);
        this.maxForce = this.p.random(5, 10);
        this.mediumSpeed = 30;
        this.mediumForce = 5;

        this.velocity = p5.Vector.random2D();
    }
}
