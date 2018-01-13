export class Bubble {
    private location: p5.Vector;
    private target: p5.Vector;
    private velocity: p5.Vector;
    private acceleration: p5.Vector;
    private maxSpeed = 9;
    private maxForce = 4;
    private mediumSpeed = 4;
    private mediumForce = 2;
    private slowDownDistance = 400;
    private mouseInfluenceDistance = 75;

    constructor(private p: p5, xStart: number, yStart: number, x: number, y: number, private radius: number) {
        this.location = p.createVector(xStart, yStart);
        this.target = p.createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.acceleration = p.createVector();
    }

    draw() {
        this.behaviors();
        this.update();

        this.p.push();
        this.p.fill(255);
        this.p.noStroke();
        this.p.ellipse(this.location.x, this.location.y, this.radius, this.radius);
        this.p.pop();
    }

    behaviors() {
        const join = this.joinTarget(this.target);
        this.applyForce(join);

        const mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
        const escape = this.escapeTargetFromMinimalDistance(mouse);
        this.applyForce(escape);
    }

    joinTarget(target: p5.Vector) {
        const desired = p5.Vector.sub(target, this.location);
        const distance = desired.mag();
        let speed = this.maxSpeed;

        if (distance < this.slowDownDistance) {
            this.maxSpeed = this.mediumSpeed;
            this.maxForce = this.mediumForce;
            speed = this.p.map(distance, 0, 100, 0, this.maxSpeed);
        } else {
            this.maxSpeed = this.maxSpeed;
            this.maxForce = this.maxForce;
        }

        desired.setMag(speed);
        const steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);

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
        this.location.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);
    }
}