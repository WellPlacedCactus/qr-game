// "QR Game" Written by Nathan Vu 12-13-2020

class Clock {
	constructor(step, cd) {
		this.timer = 0;
		this.step = step;
		this.cd = cd;
	}
	tick() {
		this.timer += this.step;
		if (this.timer > this.cd) {
			this.timer = 0;
			return true;
		} else {
			return false;
		}
	}
}

class Entity {
	constructor(x, y, r, c) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
		this.d = false;
	}
	tick() {}
	draw() {
		c.fillStyle = this.c;
		c.fillRect(
			this.x,
			this.y,
			this.r,
			this.r
		);
	}
}

class Player extends Entity {
	constructor(x, y, r) {
		super(x, y, r, pc);
		this.velX = 0;
		this.velY = 0;
		this.velMax = 4;
		this.velTerm = 7;
		this.acc = 1;
		this.dec = this.acc;
		this.canJump = false;
		this.jumpPower = 15;
	}
	tick() {
		this.input();
		this.fall();
		this.move();
	}
	input() {
		if (keys[39]) {
			this.velX += this.acc;
			if (this.velX > this.velMax) {
				this.velX = this.velMax;
			}
		} else {
			if (this.velX > 0) {
				this.velX -= this.dec;
				if (this.velX < 0) {
					this.velX = 0;
				}
			}
		}
		if (keys[37]) {
			this.velX -= this.acc;
			if (this.velX < -this.velMax) {
				this.velX = -this.velMax;
			}
		} else {
			if (this.velX < 0) {
				this.velX += this.dec;
				if (this.velX > 0) {
					this.velX = 0;
				}
			}
		}
		if (keys[17]) {
			if (this.canJump) {
				this.velY -= this.jumpPower;
				this.canJump = false;
			}
		}
	}
	fall() {
		this.velY += 1;
		if (this.velY > this.velTerm) {
			this.velY = this.velTerm;
		}
	}
	move() {
		this.x += this.velX;
		world.forEach(t => {
			if (collision(this, t)) {
				if (t.c == cc) generateWorld();
				if (this.velX > 0) {
					if (this.x + this.r > t.x) {
						this.velX = 0;
						this.x = t.x - this.r;
					}
				}
				if (this.velX < 0) {
					if (this.x < t.x + t.r) {
						this.velX = 0;
						this.x = t.x + t.r;
					}
				}
			}
		});

		this.y += this.velY;
		world.forEach(t => {
			if (collision(this, t)) {
				if (t.c == cc) generateWorld();
				if (this.velY > 0) {
					if (this.y + this.r > t.y) {
						this.velY = 0;
						this.y = t.y - this.r;
						this.canJump = true;
					}
				}
				if (this.velY < 0) {
					if (this.y < t.y + t.r) {
						this.y = t.y + t.r;
						this.velY = 0;
					}
				}
			}
		});
	}
}

const randi = (min, max) => Math.floor(Math.random() * (max - min) + min);
const collision = (e1, e2) => e1.x < e2.x + e2.r && e1.x + e1.r > e2.x && e1.y < e2.y + e2.r && e1.y + e1.r > e2.y;
const canvas = document.createElement('canvas');
const c = canvas.getContext('2d');
const mouse = {};
const keys = [];
const camera = {};

// world
const bg = 'white';
const fg = 'black';
const pc = 'green';
const cc = 'red';
const w = 32;
const h = 32;
const s = 32;
const ww = s * w;
const wh = s * h;
const world = [];
const p = new Player(0, -s, s/2);

window.onresize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
window.oncontextmenu = e => e.preventDefault();
window.onmousemove = ({x, y}) => { mouse.x = x; mouse.y = y; };
window.onmousedown = () => mouse.down = true;
window.onmouseup = () => mouse.down = false;
window.onkeydown = ({keyCode}) => keys[keyCode] = true;
window.onkeyup = ({keyCode}) => keys[keyCode] = false;
window.onload = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);
	generateWorld();
	requestAnimationFrame(loop);
}

function generateWorld() {
	world.splice(0, world.length);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			if (x < 2 && y < 2) continue;
			if (Math.random() < 0.2) {
				world.push(new Entity(
					x * s,
					y * s,
					s + 1,
					fg
				));
			}
		}
	}
	world[randi(0, world.length - w)].c = cc;
	p.x = 0;
	p.y = -s;
}

let delta;
let last;
let fps;
function loop(time) {
	delta = (time - last) / 1000;
	last = time;
	fps = Math.round(1 / delta);
	if (keys[82]) generateWorld();
	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.save();
	c.translate(100, -p.y + (canvas.height - p.r) / 2);
	world.forEach(t => {
		t.tick();
		t.draw();
	});
	p.tick();
	p.draw();
	c.restore();
	requestAnimationFrame(loop);
}