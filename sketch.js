var flock;
var canv;

function setup() {
  canv = createCanvas(windowWidth,windowHeight);
  canv.position(0,0);
  canv.style("z-index","-2")
  
//   var input = createInput();
//   input.position(width/2, height/2);

  //var button = createButton('submit');
  //button.position(input.x + input.width, 65);
  //button.mousePressed();

  flock = new Flock();
  for (var i = 0; i < 50; i++) {
    var b = new Boid(random(width),random(height));
    flock.addBoid(b);
  }
}

function draw() {
  background(0,0,51);
  flock.run();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// function mouseDragged() {
//   flock.addBoid(new Boid(mouseX,mouseY));
// }

function Flock() {
  this.boids = [];
}

Flock.prototype.run = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

function Boid(x,y) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-1,1),random(-1,1));
  this.position = createVector(x,y);
  this.r = 3.0;
  this.maxspeed = 3;   
  this.maxforce = 0.05;
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {

  this.acceleration.add(force);
}


Boid.prototype.flock = function(boids) {
  var sep = this.separate(boids);   
  var ali = this.align(boids);      
  var coh = this.cohesion(boids);   

  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);

  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}


Boid.prototype.update = function() {

  this.velocity.add(this.acceleration);

  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);

  this.acceleration.mult(0);
}


Boid.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target,this.position);

  desired.normalize();
  desired.mult(this.maxspeed);

  var steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  
  return steer;
}

Boid.prototype.render = function() {

  var theta = this.velocity.heading() + radians(90);
  fill(127);
  stroke(200);
  push();
  translate(this.position.x,this.position.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.r*2);
  vertex(-this.r, this.r*2);
  vertex(this.r, this.r*2);
  endShape(CLOSE);
  pop();
}


Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width +this.r;
  if (this.position.y < -this.r)  this.position.y = height+this.r;
  if (this.position.x > width +this.r) this.position.x = -this.r;
  if (this.position.y > height+this.r) this.position.y = -this.r;
}


Boid.prototype.separate = function(boids) {
  var desiredseparation = 25.0;
  var steer = createVector(0,0);
  var count = 0;

  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);

    if ((d > 0) && (d < desiredseparation)) {

      var diff = p5.Vector.sub(this.position,boids[i].position);
      diff.normalize();
      diff.div(d);       
      steer.add(diff);
      count++;           
    }
  }

  if (count > 0) {
    steer.div(count);
  }


  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

Boid.prototype.align = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0,0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum,this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0,0);
  }
}


Boid.prototype.cohesion = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0,0);   
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); 
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  
  } else {
    return createVector(0,0);
  }
}
