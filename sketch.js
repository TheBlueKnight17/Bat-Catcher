// BAT CATCHER - a Ghost Hunt remix
// Catch the bats before sunrise. Don't click the cursed pumpkins!

let bat, pumpkin;
let score = 0;
let best = 0;
let duration = 30;
let startTime;
let state = 'start';
let lastSpawn = 0;
let particles = [];
let stars = [];

function setup() {
  createCanvas(480, 360);
  textFont('Georgia');
  for (let i = 0; i < 40; i++) {
    stars.push({ x: random(width), y: random(280), s: random(1, 3) });
  }
  spawnBat();
  spawnPumpkin();
}

function draw() {
  // The sky slowly turns blood red as the round goes on
  let progress = 0;
  if (state === 'play') {
    progress = constrain((millis() - startTime) / 1000 / duration, 0, 1);
  }
  let sky = lerpColor(color(15, 10, 25), color(90, 10, 20), progress);
  background(sky);
  drawScene();
  updateParticles();

  if (state === 'start') {
    drawBat(width / 2, 120, 255);
    fill(255, 140, 30);
    textAlign(CENTER, CENTER);
    textSize(34);
    text('Bat Catcher', width / 2, 190);
    fill(255);
    textSize(16);
    text('Catch the bats before sunrise!', width / 2, 230);
    text('Avoid the cursed pumpkins.', width / 2, 252);
    textSize(18);
    text('Click to start', width / 2, 300);
    return;
  }

  if (state === 'over') {
    textAlign(CENTER, CENTER);
    fill(255, 140, 30);
    textSize(30);
    text('Sunrise!', width / 2, 110);
    fill(255);
    textSize(20);
    text('Bats caught: ' + score, width / 2, 160);
    text('Best: ' + best, width / 2, 190);
    textSize(16);
    text('Click to retry', width / 2, 240);
    return;
  }

  // ---- playing ----
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, duration - elapsed);
  if (timeLeft <= 0) {
    state = 'over';
    best = max(best, score);
    return;
  }

  // Gets harder over time: bats jump faster as the round goes on
  let interval = lerp(60, 25, progress);
  if (frameCount - lastSpawn >= interval) {
    spawnBat();
    spawnPumpkin();
  }

  // Bat fades in and out, and wobbles in place
  let alpha = map(sin(frameCount * 0.15), -1, 1, 140, 255);
  drawBat(bat.x + random(-1.5, 1.5), bat.y + random(-1.5, 1.5), alpha);
  drawPumpkin(pumpkin.x, pumpkin.y);

  textAlign(LEFT, TOP);
  fill(255);
  textSize(16);
  text('Bats: ' + score, 12, 10);
  textAlign(RIGHT, TOP);
  text('Sunrise in: ' + ceil(timeLeft), width - 12, 10);
}

function mousePressed() {
  if (state === 'start' || state === 'over') {
    state = 'play';
    score = 0;
    startTime = millis();
    particles = [];
    spawnBat();
    spawnPumpkin();
    return;
  }
  if (dist(mouseX, mouseY, bat.x, bat.y) < 30) {
    score++;
    burst(bat.x, bat.y, color(190, 120, 255));
    spawnBat();
    spawnPumpkin();
  } else if (dist(mouseX, mouseY, pumpkin.x, pumpkin.y) < 28) {
    score = max(0, score - 1);
    burst(pumpkin.x, pumpkin.y, color(255, 120, 20));
    spawnBat();
    spawnPumpkin();
  }
}

function spawnBat() {
  bat = { x: random(50, width - 50), y: random(50, 270) };
  lastSpawn = frameCount;
}

function spawnPumpkin() {
  // keep the pumpkin away from the bat so they don't overlap
  do {
    pumpkin = { x: random(50, width - 50), y: random(50, 270) };
  } while (dist(pumpkin.x, pumpkin.y, bat.x, bat.y) < 70);
}

function drawScene() {
  noStroke();
  // stars
  fill(255, 255, 255, 180);
  for (let s of stars) ellipse(s.x, s.y, s.s);
  // moon
  fill(255, 240, 200);
  ellipse(410, 55, 50, 50);
  fill(235, 220, 180);
  ellipse(400, 48, 10, 10);
  ellipse(417, 62, 7, 7);
  // ground
  fill(40, 30, 50);
  rect(0, 300, 480, 60);
  // tombstones
  fill(70, 60, 85);
  for (let tx of [40, 150, 330, 440]) {
    rect(tx, 285, 28, 35);
    arc(tx + 14, 285, 28, 28, PI, TWO_PI);
  }
}

function drawBat(x, y, alpha) {
  noStroke();
  fill(60, 30, 90, alpha);
  // wings
  triangle(x - 8, y - 4, x - 40, y - 16, x - 28, y + 10);
  triangle(x + 8, y - 4, x + 40, y - 16, x + 28, y + 10);
  triangle(x - 28, y + 10, x - 20, y + 4, x - 14, y + 14);
  triangle(x + 28, y + 10, x + 20, y + 4, x + 14, y + 14);
  // body and ears
  ellipse(x, y, 26, 30);
  triangle(x - 10, y - 10, x - 6, y - 24, x - 2, y - 12);
  triangle(x + 10, y - 10, x + 6, y - 24, x + 2, y - 12);
  // eyes
  fill(255, 60, 60, alpha);
  ellipse(x - 5, y - 4, 5);
  ellipse(x + 5, y - 4, 5);
  // fangs
  fill(255, alpha);
  triangle(x - 4, y + 4, x - 2, y + 4, x - 3, y + 9);
  triangle(x + 4, y + 4, x + 2, y + 4, x + 3, y + 9);
}

function drawPumpkin(x, y) {
  noStroke();
  fill(230, 110, 20);
  ellipse(x, y, 50, 44);
  ellipse(x - 12, y, 28, 42);
  ellipse(x + 12, y, 28, 42);
  fill(40, 120, 40);
  rect(x - 3, y - 28, 6, 10);
  // evil face
  fill(30, 10, 0);
  triangle(x - 12, y - 6, x - 4, y - 6, x - 8, y - 14);
  triangle(x + 12, y - 6, x + 4, y - 6, x + 8, y - 14);
  arc(x, y + 6, 26, 16, 0, PI);
}

function burst(x, y, c) {
  for (let i = 0; i < 18; i++) {
    let a = random(TWO_PI);
    let sp = random(1, 4);
    particles.push({ x: x, y: y, vx: cos(a) * sp, vy: sin(a) * sp, life: 255, c: c });
  }
}

function updateParticles() {
  noStroke();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 8;
    fill(red(p.c), green(p.c), blue(p.c), p.life);
    ellipse(p.x, p.y, 6);
    if (p.life <= 0) particles.splice(i, 1);
  }
}