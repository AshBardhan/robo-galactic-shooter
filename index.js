const ctx = myCanvas.getContext("2d");
const angleRadianRatio = (Math.PI / 180);

kontra.init();

let ctl = ctx.translate.bind(ctx);
let cbp = ctx.beginPath.bind(ctx);
let ccp = ctx.closePath.bind(ctx);
let clt = ctx.lineTo.bind(ctx);
let cmt = ctx.moveTo.bind(ctx);
let cr = ctx.rotate.bind(ctx);
let cs = ctx.scale.bind(ctx);
let crt = ctx.resetTransform.bind(ctx);
let cf = ctx.fill.bind(ctx);
let cfr = ctx.fillRect.bind(ctx);
let cac = ctx.arc.bind(ctx);

let kcw = kontra.canvas.width;
let kch = kontra.canvas.height;
let kkp = kontra.keys.pressed.bind(kontra);
let ks = kontra.sprite.bind(kontra);

function checkCollision(obj1, obj2) {
	return (obj1.x < obj2.x + obj2.width &&
		obj1.x + obj1.width > obj2.x &&
		obj1.y < obj2.y + obj2.height &&
		obj1.y + obj1.height > obj2.y);
}

function intervalManager(id, flag, time, callback) {
	return flag ? setInterval(callback, time) : clearInterval(id);
}

function randValue(end, start = 0, factor = 1) {
	return Math.floor(Math.random() * end + start) * factor;
}

function renderBg() {
	let grd = ctx.createLinearGradient(kcw / 2, 0, kcw / 2, kch);
	grd.addColorStop(0.3, "#101014");
	grd.addColorStop(0.7, "#141852");
	grd.addColorStop(1, "#35274E");
	ctx.fillStyle = grd;
	cfr(0, 0, kcw, kch);
}

let asteroids = [];
const asteroidColors = [
	"#F3C099",
	"#AEA2D1",
	"#DBD272",
	"#DBC098",
	"#798495"
];

let stars = [];
let bullets = [];
let bgStarsSize = 100;

let lvls = [];
let maxLvl = 50;
let lvl = 1;

for (let i = 0; i < maxLvl; i++) {
	lvls.push({
		id: i + 1,
		time: Math.ceil((maxLvl - i) / 5) * 500,
		fa: (i % 5) + 2,
		ta: (i + 1) * 5,
		ma: Math.ceil((i + 1) / 5) * 20,
		fs: (i % 5) + 1,
		ms: i + 5
	});
}

let battery = ks({
	x: kcw - 100,
	y: 15,
	width: 50,
	height: 30,
	percent: 100,
	colorCodes: ["#05A84E", "#F7C808", "#FE251D"],
	getColorCode() {
		let index = 0;
		if (this.percent <= 75) {
			index = 1;
		}
		if (this.percent <= 25) {
			index = 2;
		}
		return this.colorCodes[index];
	},
	update() {
		if (this.percent >= 100) {
			this.percent = 100;
		}
		if (this.percent <= 0) {
			this.percent = 0;
		}
	},
	render() {
		ctl(this.x, this.y);
		cbp();
		ctx.strokeStyle = "#fff";
		ctx.fillStyle = "#fff";
		ctx.lineWidth = 4;
		ctx.strokeRect(0, 0, this.width, this.height);
		cfr(this.width + 4, this.height / 2 - 10, 4, 20);
		ccp();
		cbp();
		ctx.fillStyle = this.getColorCode();
		cfr(2, 2, this.percent / 100 * (this.width - 4), this.height - 4);
		ccp();
		crt();
	}
});

function createBullet(x, y, width, height) {
	let bullet = ks({
		x: x + width,
		y: y + height / 2,
		dx: 10,
		size: 10,
		get width() {
			return this.size;
		},
		get height() {
			return this.size;
		},
		update() {
			this.x += this.dx;
		},
		render() {
			ctl(this.x, this.y);
			cbp();
			ctx.fillStyle = "#fff";
			cac(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
			cf();
			ccp();
			crt();
		}
	});
	bullets.push(bullet);
}

let player = ks({
	x: -kcw,
	y: 80,
	width: 240,
	height: 80,
	alive: false,
	dx: 5,
	dy: 2,
	dt: 0,
	bdt: 0,
	lvla: 0,
	score: 0,
	hiScore: localStorage.getItem('hiScore') || 0,
	update() {
		//this.advance();
		if (!gamePlay.menu.visible) {
			if (this.alive) {
				this.bdt += 1 / 60;
				if (kkp('left') && this.x >= 0) {
					this.x -= this.dx;
				}
				if (kkp('right') && this.x + this.width <= 2 * kcw / 3) {
					this.x += this.dx;
				}
				if (kkp('up') && this.y >= 50) {
					this.y -= this.dy;
				}
				if (kkp('down') && this.y + this.height <= kch) {
					this.y += this.dy;
				}
				if (kkp('space') && this.bdt > 0.25) {
					this.bdt = 0;
					createBullet(this.x, this.y, this.width, this.height);
				}
			} else {
				this.bdt = 0;
				this.y += 10;
			}
		}
		if (gamePlay.gmst.visible) {
			this.x += this.dx;
		}
	},
	render() {
		// ctx.strokeStyle = 'yellow';
		// ctx.lineWidth = 2;
		// ctx.strokeRect(this.x, this.y, this.width, this.height);

		ctl(this.x + 35, this.y + 70);
		ctl(this.width / 2, this.height / 2);
		cr(80 * angleRadianRatio);
		ctl(-this.width / 2, -this.height / 2);
		cbp();
		ctx.fillStyle = "#1B7851";
		cmt(35, -5);
		clt(65, -5);
		clt(67, 5);
		clt(33, 5);
		cf();
		cfr(35, 5, 30, 15);
		cfr(15, 20, 70, 40);
		cfr(-5, 10, 20, 60);
		cfr(20, 70, 60, 20);
		cfr(35, 120, 30, 60);
		cfr(30, 160, 50, 20);
		ccp();
		if (this.alive) {
			//flame
			cbp();
			ctx.fillStyle = "#FEDA94";
			cfr(-5, 70, 20, kcw);
			cfr(40, 180, 25, kcw);
			ccp();
			cbp();
			ctx.fillStyle = "#FECE5F";
			cfr(0, 70, 10, kcw);
			cfr(45, 180, 15, kcw);
			ccp();
			cbp();
		}
		ctx.fillStyle = "#DDDEE2";
		cfr(25, 60, 50, 10);
		cfr(40, 90, 20, 30);
		ccp();
		cbp();
		ctx.fillStyle = "#f7912e";
		cac(50, 13, 5, 0, 2 * Math.PI);
		cf();
		ccp();
		cbp();
		ctx.fillStyle = "rgba(0,0,0,0.15)";
		cac(50, 13, 3, 0, 2 * Math.PI);
		cf();
		ccp();
		//arm
		cbp();
		ctl(50, 40);
		cr(-170 * angleRadianRatio);
		ctl(-50, -40);
		ctx.fillStyle = "rgba(0,0,0,0.25)";
		cac(50, 40, 18, 0, 2 * Math.PI);
		cf();
		ccp();
		cbp();
		ctx.fillStyle = "#DDDEE2";
		cfr(40, 40, 20, 35);
		ccp();
		cbp();
		ctx.fillStyle = "#1B7851";
		cac(50, 40, 13, 0, 2 * Math.PI);
		cf();
		cfr(35, 75, 30, 35);
		cfr(39, 120, 22, 15);
		ccp();
		cbp();
		ctx.fillStyle = "#f7912e";
		cfr(35, 110, 30, 10);
		ccp();
		crt();
	}
});

function createAsteroid(size) {
	if (size === 0 || asteroids.length === lvls[lvl - 1].ma) {
		return;
	}
	let asteroid = ks({
		x: 2 * kcw,
		y: randValue(440, 100),
		deg: 0,
		spin: randValue(5, 1),
		size: randValue(3, 1, 30),
		craters: 6,
		dx: randValue(5, 2, 2),
		colorCode: randValue(asteroidColors.length),
		get power() {
			return this.size / 30;
		},
		get width() {
			return this.size;
		},
		get height() {
			return this.size;
		},
		update() {
			//this.advance();
			this.x -= this.dx;

			if (this.x <= -this.size) {
				this.x = kcw;
			}

			this.deg -= this.spin;
		},
		render() {
			//this.draw();

			// ctx.strokeStyle = 'yellow';
			// ctx.lineWidth = 2;
			// ctx.strokeRect(this.x, this.y, this.size, this.size);

			ctl(this.x, this.y);
			ctl(this.size / 2, this.size / 2);
			cr(this.deg * angleRadianRatio);
			let scaleSize = 30 * this.power / this.size;
			cs(scaleSize, scaleSize);
			ctl(-this.size / 2, -this.size / 2);

			cbp();
			ctx.fillStyle = asteroidColors[this.colorCode];
			cac(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
			cf();
			ccp();
			for (let i = 1; i <= this.craters; i++) {
				ctl(this.size / 2, this.size / 2);
				cr(360 / this.craters * angleRadianRatio);
				ctl(-this.size / 2, -this.size / 2);
				cbp();
				ctx.fillStyle = asteroidColors[this.colorCode];
				cac(this.size / 8, this.size / 8, this.size / 10, 0, 2 * Math.PI);
				cf();
				ccp();
				if (i % 2 === 0) {
					cbp();
					ctx.fillStyle = "rgba(0,0,0,0.35)";
					cac(this.size / 4, this.size / 2, this.size / 8, 0, 2 * Math.PI);
					cf();
					ccp();
				}
			}
			crt();
		}
	});

	asteroids.push(asteroid);
	createAsteroid(size - 1);
}

function createStar(size, hasPower = false) {
	if (size === 0 || stars.length === lvls[lvl - 1].ms + bgStarsSize) {
		return;
	}
	let star = ks({
		x: kcw + randValue(55, 0, 20),
		y: randValue(25, 3, 25),
		size: 12,
		alpha: 0,
		da: 2,
		power: hasPower,
		dx: 10,
		update() {
			if (this.power) {
				this.alpha += this.da;
				if (this.alpha >= 150 || this.alpha <= 0) {
					this.da *= -1;
				}
			}
			this.x -= (this.power ? this.dx * 3 / 2 : this.dx);

			if (this.x <= -this.size) {
				this.x = kcw;
			}
		},
		render() {
			//ctx.strokeStyle = 'yellow';
			//ctx.lineWidth = 2;
			//ctx.strokeRect(this.x, this.y, this.size, this.size);

			ctl(this.x, this.y);
			cbp();
			ctx.fillStyle = this.power ? "#ffcf40" : "#fff";
			ctx.ellipse(this.size / 2, this.size / 2, 1, this.size / 2, 0, 0, 2 * Math.PI);
			//ctx.ellipse(this.size/2, this.size/2, 1, this.size/2, 0.2 * Math.PI, 0, 2 * Math.PI);
			ctx.ellipse(this.size / 2, this.size / 2, 1, this.size / 2, 0.5 * Math.PI, 0, 2 * Math.PI);
			//ctx.ellipse(this.size/2, this.size/2, 1, this.size/2, 0.8 * Math.PI, 0, 2 * Math.PI);
			cf();
			ccp();
			if (this.power) {
				cbp();
				ctx.fillStyle = `rgba(255,207,64,${this.alpha / 255})`;
				cac(this.size / 2, this.size / 2, 3 * this.size / 5, 0, 2 * Math.PI);
				cf();
				ccp();
			}
			crt();
		}
	});

	stars.push(star);
	createStar(size - 1);
}

function unsetSAInterval() {
	intervalManager(saiID, false);
}

function setSAInterval() {
	saiID = intervalManager(saiID, true, lvls[lvl - 1].time, saiCallback);
}

function endGame() {
	player.alive = false;
	gamePlay.cnt.visible = true;
	unsetSAInterval();
	kontra.keys.unbind('p');
}

function roundInt(val) {
	return Math.ceil(val);
}

let gamePlay = {
	heading: {
		visible: true,
		title: ['Robo', 'Galactic', 'Shooter']
	},
	menu: {
		visible: true,
		dt: 0,
		options: [
			{
				title: 'Play Game',
				slct: false,
				hvr: true,
			},
			{
				title: 'Instructions',
				slct: false,
				hvr: false,
			}
		]
	},
	inst: {
		visible: false,
	},
	gmst: {
		visible: false,
		ttl: 3,
		msg: 'start game'
	},
	cnt: {
		visible: false,
		ttl: 9,
		msg: 'continue'
	},
	gmovr: {
		visible: false,
		ttl: 3,
		msg: 'game over'
	}
};

function renderText() {
	drawPixel(ctx, `Level`, 250, 10);
	drawPixel(ctx, `${lvl}/${maxLvl}`, 350, 10);
	drawPixel(ctx, `Target`, 250, 35);
	drawPixel(ctx, `${player.lvla}/${lvls[lvl - 1].ta}`, 350, 35);

	drawPixel(ctx, `Score`, 550, 10);
	drawPixel(ctx, `${player.score}`, 680, 10);
	drawPixel(ctx, `Hi-Score`, 550, 35);
	drawPixel(ctx, `${player.hiScore}`, 680, 35);

	if (gamePlay.heading.visible) {
		drawPixel(ctx, `${gamePlay.heading.title[0]}`, (kcw - `${gamePlay.heading.title[0]}`.length * 55) / 2, 125, 15);
		drawPixel(ctx, `${gamePlay.heading.title[1]}`, (kcw - `${gamePlay.heading.title[1]}`.length * 60) / 2, 225, 15);
		drawPixel(ctx, `${gamePlay.heading.title[2]}`, (kcw - `${gamePlay.heading.title[2]}`.length * 56) / 2, 325, 15);
	}

	if (gamePlay.menu.visible) {
		drawPixel(ctx, `${gamePlay.menu.options[0].title}`, (kcw - `${gamePlay.menu.options[0].title}`.length * 40) / 2, 475, 10, gamePlay.menu.options[0].hvr ? "#FEDA94" : undefined);
		drawPixel(ctx, `${gamePlay.menu.options[1].title}`, (kcw - `${gamePlay.menu.options[1].title}`.length * 40) / 2, 575, 10, gamePlay.menu.options[1].hvr ? "#FEDA94" : undefined);
	}

	if (gamePlay.inst.visible) {
		drawPixel(ctx, `your planet is under threat as the asteroids`, 20, 455);
		drawPixel(ctx, `are approaching with uncertain speed. your`, 20, 485);
		drawPixel(ctx, `mission is to destroy all the asteroids before`, 20, 515);
		drawPixel(ctx, `your battery is drained out completely and`, 20, 545);
		drawPixel(ctx, `making you offline permanently.`, 20, 575);
		drawPixel(ctx, `survival tip`, 20, 615,4);
		drawPixel(ctx, `look for golden stars to recharge your battery.`, 20, 645);

		drawPixel(ctx, `controls`, 675, 455, 4);
		drawPixel(ctx, `arrow keys`, 675, 495);
		drawPixel(ctx, `move`, 835, 495);
		drawPixel(ctx, `space`, 675, 525);
		drawPixel(ctx, `shoot`, 835, 525);
		drawPixel(ctx, `p`, 675, 555);
		drawPixel(ctx, `pause/resume`, 835, 555);
		drawPixel(ctx, `enter`, 675, 585);
		drawPixel(ctx, `confirm`, 835, 585);
		//drawPixel(ctx, `esc`, 675, 615);
		//drawPixel(ctx, `quit`, 835, 615);
	}

	if (gamePlay.cnt.visible) {
		drawPixel(ctx, `${gamePlay.cnt.msg}`, (kcw - `${gamePlay.cnt.msg}`.length * 40) / 2, 235, 10);
		drawPixel(ctx, `${roundInt(gamePlay.cnt.ttl)}`, (kcw - `${roundInt(gamePlay.cnt.ttl)}`.length * 50) / 2, 305, 20);
	}

	if (gamePlay.gmst.visible) {
		drawPixel(ctx, `${gamePlay.gmst.msg}`, (kcw - `${gamePlay.gmst.msg}`.length * 20) / 2, 255, 5);
		drawPixel(ctx, `${roundInt(gamePlay.gmst.ttl)}`, (kcw - `${roundInt(gamePlay.gmst.ttl)}`.length * 50) / 2, 305, 10);
	}

	if (gamePlay.gmovr.visible) {
		drawPixel(ctx, `${gamePlay.gmovr.msg}`, (kcw - `${gamePlay.gmovr.msg}`.length * 64) / 2, 275, 15);
	}
}

let loop = kontra.gameLoop({
	fps: 60,
	update() {
		let i, j;

		[].concat(...[player], ...stars, ...asteroids, ...bullets, ...[battery]).map(sprite => {
			sprite.update();
		});

		for (i = 0; i < asteroids.length; i++) {
			for (j = 0; j < bullets.length; j++) {
				if (checkCollision(bullets[j], asteroids[i])) {
					if (!--asteroids[i].power) {
						player.lvla += 1;
						//console.log(`hit - ${player.lvla}/${lvls[lvl - 1].ta}`);
					}
					break;
				}
			}
			if (j !== bullets.length) {
				bullets.splice(j, 1);
				player.score += 50;
				break;
			}
			if (player.collidesWith(asteroids[i])) {
				battery.percent -= (asteroids[i].power * 10);
				player.x -= (asteroids[i].power * 20);
				asteroids[i].power = 0;
				break;
			}
		}

		if (i !== asteroids.length && asteroids[i].power === 0) {
			asteroids.splice(i, 1);
		}

		for (i = 0; i < bullets.length; i++) {
			if (bullets[i].x >= kcw) {
				break;
			}
		}
		bullets.splice(i, 1);

		for (i = 0; i < stars.length; i++) {
			if (player.collidesWith(stars[i]) && stars[i].power) {
				battery.percent += stars[i].size;
				break;
			}
		}
		stars.splice(i, 1);

		if (player.score > player.hiScore) {
			player.hiScore = player.score;
		}

		if (player.lvla >= lvls[lvl - 1].ta) {
			lvl = (lvl === 50) ? 50 : ++lvl;
			player.lvla = 0;
			//console.log('level up!');
			unsetSAInterval();
			setSAInterval();
		}

		if (battery.percent <= 0) {
			endGame();
		}

		if (gamePlay.gmst.visible) {
			if (roundInt(gamePlay.gmst.ttl) >= 0) {
				gamePlay.gmst.ttl -= 1 / 60;
			} else {
				gamePlay.gmst.visible = false;
			}
		}


		if (gamePlay.cnt.visible) {
			localStorage.setItem('hiScore', player.hiScore);
			if (roundInt(gamePlay.cnt.ttl) >= 0) {
				gamePlay.cnt.ttl -= 1 / 60;
			} else {
				gamePlay.cnt.visible = false;
				gamePlay.gmovr.visible = true;
			}

			if (kkp('enter')) {
				gamePlay.gmst.ttl = 3;
				gamePlay.cnt.ttl = 9;
				gamePlay.cnt.visible = false;
				player.score = 0;
				battery.percent = 100;
				startGame();
			}
		}

		if (gamePlay.gmovr.visible) {
			if (roundInt(gamePlay.gmovr.ttl) >= 0) {
				gamePlay.gmovr.ttl -= 1 / 60;
			} else {
				resetGame();
			}
		}

		if (gamePlay.menu.visible) {
			gamePlay.menu.dt += 1 / 60;
			if ((kkp('up') || kkp('down')) && gamePlay.menu.dt > 0.25) {
				gamePlay.menu.options[0].hvr = !gamePlay.menu.options[0].hvr;
				gamePlay.menu.options[1].hvr = !gamePlay.menu.options[1].hvr;
				gamePlay.menu.dt = 0;
			}

			if (kkp('enter') && gamePlay.menu.dt > 0.25) {
				gamePlay.menu.dt = 0;
				gamePlay.menu.visible = false;
				if (gamePlay.menu.options[0].hvr) {
					gamePlay.heading.visible = false;
					startGame();
				} else {
					gamePlay.inst.visible = true;
				}
			}
		}

		if (gamePlay.inst.visible) {
			gamePlay.menu.dt += 1 / 60;
			if(kkp('enter') && gamePlay.menu.dt > 0.25) {
				gamePlay.inst.visible = false;
				gamePlay.menu.visible = true;
				gamePlay.menu.dt = 0;
			}
		}
	},
	render() {
		renderBg();
		[].concat(...stars, ...[player], ...asteroids, ...bullets, ...[battery]).map(sprite => {
			sprite.render();
		});
		renderText();
	}
});

let saiID = null;
let saiCallback = () => {
	createStar(1, true);
	createAsteroid(2);
};

createStar(bgStarsSize);
loop.start();

function resetGame() {
	asteroids.length = 0;
	stars.length = bgStarsSize;
	gamePlay.gmovr.visible = false;
	gamePlay.menu.visible = true;
	gamePlay.heading.visible = true;
	player.lvla = 0;
	player.score = 0;
	lvl = 1;
	battery.percent = 100;
	gamePlay.cnt.ttl = 9;
	gamePlay.gmovr.ttl = 3;
	gamePlay.gmst.ttl = 3;
}

function startGame() {
	gamePlay.gmst.visible = true;
	player.x = -kcw;
	player.y = 80;
	player.alive = true;
	setSAInterval();
	kontra.keys.bind('p', () => {
		if (!loop.isStopped) {
			loop.stop();
			unsetSAInterval();
		} else {
			loop.start();
			setSAInterval();
		}
	});
}