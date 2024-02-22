(function init() {
	const sm = {
		sl: '111114YA69VjV2TF883n6f74g6pdmvw94esjz2Fg9dVLMafmEXKsLhDNrqyMiHgYJLUFEU4BBbMM2fbPNNkEPnFr2gKqHzZest5dM9rcxKvMBfZaNVG7wsFV',
		rs: '34T6PkuM9azcqQRP2uhqSKehYPVttMZPtXpjTTUjUwxb7py2H6TKgBffhrzZ7nPmKhP9JD3gEhifVkUezyWGSUnQyk8ogjYL61H2E9d5KhKMhhHhaxT3G4jR1',
		sh: '111112tu2RTz4ZLfm6nwnmzVVYDerCJ1GUa66TYpw6EgKckrbkxXbT14CJiEqBnf3cjD3aFriqdKZs6A8QJB2AYqbmYX8qYaJRnwaipyeGThYFXGoKQKWwgB',
		lu: '111119SowJUqZyfe4jLRUfMiWf8c8WYnkjRBJUL3ZZaCqfAeNPhf9rVc62kRS3jD3J63z77A6QF6Mhazdo7kb9hjbyQ3JUTCLeAmStvwTzmPMhnSREk4jzYP',
		pw: '34T6PksDM6sxLWXsKMV54x6nBYTVK2X82XguTcaNo2PNHaSYwAgcpjW5ZD5MLL4xexbsTeVEWu6cDStLHKr2ey2kqMcTGr9p7MYBp157yy7xG3Mhu9rpQWJqd',
		php: '7BMHBGQKT6faneej8J2UfgXkv259Mh1u9B4bysSRxEYy7VtvWt4cdFK5MwuM5pAWp8rdGDfJai6329LzskzZkh9ipbXn4rDdD1YQjJYCzXxoV1JgQzadPpXfu',
		bhp: '7BMHBGLmaZAt72j4pAcPAVnSrSTf2sb9NC6LKmg8cmfTtK5cFcHvPcUGnfH99T7EAeTwdLUYEMKEHKYm4VTVLuJywmfAAR3XthQc3v361s6Lq6UJQLBuW6a6b',
		bhc: '7BMHBGGGKzwmnk2LXPSFk2ZR1UCBQV7GsbQ51LNWWc2ZJkkZBaLs1QbPoCe86BcCp69QnKH67dcF48hGfrriBi5Xdf4a8jnYma3QvDjHm5QQcR5cezjbEECBR',
	};

	function generateSound(c) {
		return new SoundEffect(c).generate();
	}

	let sx = {};
	for (const n in sm) {
		sx[n] = generateSound(sm[n]).getAudio();
	}

	const ctx = myCanvas.getContext('2d');
	const angleRadianRatio = Math.PI / 180;
	const tp = angleRadianRatio * 360;

	let kn = kontra;
	kn.init();

	let canvasWidth = kn.canvas.width;
	let canvasHeight = kn.canvas.height;
	let keyPressed = kn.keys.pressed.bind(kn);
	let sprite = kn.sprite.bind(kn);

	// Check Collision  between two objects 'o1' and 'o2'
	function detectCollosion(o1, o2) {
		return o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y;
	}

	function intervalMethod(id, flag, time, callback) {
		return flag ? setInterval(callback, time) : clearInterval(id);
	}

	function randomValue(end, start = 0, factor = 1) {
		return Math.floor(Math.random() * end + start) * factor;
	}

	function drawPixel(s, dx = 0, dy = 0, sz = 3, fc = '#fff') {
		let needed = [];
		let i, x, y, ch;
		s = s.toUpperCase();
		for (i = 0; i < s.length; i++) {
			ch = chrs[s.charAt(i)];
			if (ch) {
				needed.push(ch);
			}
		}

		ctx.translate(dx, dy);
		ctx.beginPath();
		ctx.fillStyle = fc;
		let currX = 0;
		for (i = 0; i < needed.length; i++) {
			ch = needed[i];
			let currY = 0;
			let addX = 0;
			for (y = 0; y < ch.length; y++) {
				let row = ch[y];
				for (x = 0; x < row.length; x++) {
					if (row[x]) {
						ctx.fillRect(currX + x * sz, currY, sz, sz);
					}
				}
				addX = Math.max(addX, row.length * sz);
				currY += sz;
			}
			currX += sz + addX;
		}
		ctx.closePath();
		ctx.resetTransform();
	}

	function renderBackground() {
		let g = ctx.createLinearGradient(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
		let ga = g.addColorStop.bind(g);
		ga(0.3, '#101014');
		ga(0.7, '#141852');
		ga(1, '#35274E');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	}

	// Asteroids
	let asteroids = [];

	// Stars
	let ss = [];
	let bsz = 100;

	// Bullets
	let bullets = [];

	// Levels
	let ls = [];
	let ml = 50;
	let l = 1;

	// Flipping Scores
	let fla = 99999;
	let fls = 9999999999;

	for (let i = 0; i < ml; i++) {
		ls.push({
			ti: Math.ceil((ml - i) / 5) * 250,
			fa: (i % 5) + 2,
			ta: (i + 1) * 5,
			ma: Math.ceil((i + 1) / 5) * 20,
			fs: (i % 5) + 1,
			ms: i + 5,
		});
	}

	// Battery
	let battery = sprite({
		x: canvasWidth - 100,
		y: 15,
		width: 50,
		height: 30,
		percent: 100, // Percent Left
		colorCodes: ['#05A84E', '#FE251D', '#F7C808'],
		time: 1,
		getColorIndex() {
			// Battery Level that will determine its color and blinking
			return this.percent <= 20 ? 1 : this.percent <= 60 ? 2 : 0;
		},
		getColorCode() {
			return this.colorCodes[this.getColorIndex()];
		},
		update() {
			if (this.percent >= 100) {
				this.percent = 100;
			}
			if (this.percent <= 0) {
				this.percent = 0;
			}

			if (this.getColorIndex()) {
				this.time -= 1 / (10 * this.getColorIndex());
				if (roundInteger(this.time) < -1) {
					this.time = 1;
				}
			}
		},
		render() {
			if (roundInteger(this.time) >= 0) {
				ctx.translate(this.x, this.y);
				ctx.beginPath();
				ctx.strokeStyle = '#fff';
				ctx.fillStyle = '#fff';
				ctx.lineWidth = 4;
				ctx.strokeRect(0, 0, this.width, this.height);
				ctx.fillRect(this.width + 4, this.height / 2 - 10, 4, 20);
				ctx.closePath();
				ctx.beginPath();
				ctx.fillStyle = this.getColorCode();
				ctx.fillRect(2, 2, (this.percent / 100) * (this.width - 4), this.height - 4);
				ctx.closePath();
				ctx.resetTransform();
			}
		},
	});

	// Bullets
	function createBullet(player) {
		let bullet;
		let bulletImage = new Image();
		bulletImage.src = '../assets/bullet.svg';
		bulletImage.onload = function () {
			bullet = sprite({
				x: player.x + player.width,
				y: player.y + player.height / 2,
				dx: 10,
				width: 120,
				height: 45,
				image: bulletImage,
				update() {
					this.x += this.dx;
				},
			});
			bullets.push(bullet);
		};
	}

	// Player
	let player;
	let playerImage = new Image();
	playerImage.src = '../assets/player.svg';
	playerImage.onload = function () {
		player = sprite({
			x: -canvasWidth,
			y: 80,
			width: 120,
			height: 60,
			image: playerImage,
			alive: 0, // Alive
			dx: 5,
			dy: 2,
			dt: 0,
			bdt: 0,
			level: 0,
			score: 0,
			hiScore: localStorage.getItem('hiScore') || 0,
			update() {
				if (!g.m.v) {
					if (this.alive) {
						this.bdt += 1 / 60;
						if (keyPressed('left') && this.x >= 0 && !g.s.v) {
							this.x -= this.dx;
						}
						if (keyPressed('right') && this.x + this.width <= (2 * canvasWidth) / 3 && !g.s.v) {
							this.x += this.dx;
						}
						if (keyPressed('up') && this.y >= 50) {
							this.y -= this.dy;
						}
						if (keyPressed('down') && this.y + this.height <= canvasHeight) {
							this.y += this.dy;
						}
						if (keyPressed('space') && this.bdt > 0.1) {
							sx.sh.play();
							this.bdt = 0;
							createBullet(this);
						}
					} else {
						this.bdt = 0;
						this.y += 10;
					}
				}
				if (g.s.v) {
					this.x += this.dx;
				}
			},
		});
	};

	// Asteroid
	function createAsteroids(sz) {
		if (sz === 0 || a.length === ls[l - 1].ma) {
			return;
		}

		let asteroid;
		let asteroidImage = new Image();
		asteroidImage.src = '../assets/asteroid.svg';
		asteroidImage.onload = function () {
			asteroid = sprite({
				x: 2 * canvasWidth,
				y: randomValue(440, 100),
				degree: 0,
				spin: randomValue(5, 1),
				size: randomValue(4, 1, 25),
				dx: randomValue(5, 2, 2),
				colorCode: randomValue(12, 1, 30),
				image: asteroidImage,
				get power() {
					return this.size / 25;
				},
				get width() {
					return this.size;
				},
				get height() {
					return this.size;
				},
				update() {
					this.x -= this.dx;

					if (this.x <= -this.size) {
						this.x = canvasWidth;
					}

					this.degree -= this.spin;
				},
				render() {
					ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
					ctx.rotate(this.degree * angleRadianRatio);
					let renderSize = (this.power * 25) / 100;
					ctx.scale(renderSize, renderSize);
					ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
					ctx.beginPath();
					ctx.filter = `hue-rotate(${this.colorCode}deg)`;
					this.draw();
					ctx.filter = 'none';
					ctx.resetTransform();
				},
			});
			asteroids.push(asteroid);
		};

		createAsteroids(sz - 1);
	}

	// Stars
	function createStars(sz, p = 0) {
		if (sz === 0 || ss.length === ls[l - 1].ms + bsz) {
			return;
		}
		let st = sprite({
			x: canvasWidth + randomValue(55, 0, 20),
			y: randomValue(25, 3, 25),
			s: 20, // Size
			a: 0, // Alpha/Opacity
			da: 2,
			p: p,
			dx: 10,
			update() {
				if (this.p) {
					this.a += this.da;
					if (this.a >= 150 || this.a <= 0) {
						this.da *= -1;
					}
				}
				this.x -= this.p ? (this.dx * 3) / 2 : this.dx;

				if (this.x <= -this.s) {
					this.x = canvasWidth;
				}
			},
			render() {
				let sz = this.p ? this.s : this.s / 2;

				ctx.translate(this.x, this.y);
				ctx.beginPath();
				ctx.fillStyle = this.p ? '#ffcf40' : '#fff';
				ctx.ellipse(sz, sz, 1, sz, 0, 0, tp);
				ctx.ellipse(sz, sz, 1, sz, angleRadianRatio * 90, 0, tp);
				ctx.fill();
				ctx.closePath();
				if (this.p) {
					ctx.beginPath();
					ctx.fillStyle = `rgba(255,207,64,${this.a / 255})`;
					ctx.arc(sz, sz, (4 * sz) / 5, 0, tp);
					ctx.fill();
					ctx.closePath();
				}
				ctx.resetTransform();
			},
		});

		ss.push(st);
		createStars(sz - 1);
	}

	// Unset Intervals
	function unsetGameIntervals() {
		intervalMethod(ii, 0);
	}

	// Set Intervals
	function setGameIntervals() {
		ii = intervalMethod(ii, 1, ls[l - 1].ti, () => {
			createStars(ls[l - 1].fs, 1);
			createAsteroids(ls[l - 1].fa);
		});
	}

	// End Game
	function endGame() {
		player.alive = 0;
		g.c.v = 1;
		unsetGameIntervals();
		kn.keys.unbind('p');
	}

	function roundInteger(val) {
		return Math.ceil(val);
	}

	// Game Play Titles
	let g = {
		h: {
			// Heading
			v: 1,
			m: ['Robo', 'Galactic', 'Shooter'],
		},
		m: {
			// Menu
			v: 1,
			dt: 0,
			l: [
				{
					m: 'Play Game',
					s: 1,
				},
				{
					m: 'Instructions',
					s: 0,
				},
			],
		},
		i: {
			// Instructions
			v: 0,
		},
		s: {
			// Game Start
			v: 0,
			t: 3,
			m: 'start game',
		},
		t: {
			v: 0,
			t: 2,
			i: 0,
			m: ['boom', 'ouch', 'level up'],
		},
		c: {
			// Continue Game
			v: 0,
			t: 9,
			m: 'continue',
		},
		o: {
			// Game Over
			v: 0,
			t: 3,
			m: 'game over',
		},
	};

	function renderTexts() {
		drawPixel(`Level`, 280, 10);
		drawPixel(`${l}/${ml}`, 380, 10);
		drawPixel(`Target`, 280, 35);
		drawPixel(`${player?.level ?? 0}/${ls[l - 1].ta}`, 380, 35);

		drawPixel(`Score`, 550, 10);
		drawPixel(`${player?.score ?? 0}`, 680, 10);
		drawPixel(`Hi-Score`, 550, 35);
		drawPixel(`${player?.hiScore ?? 0}`, 680, 35);

		if (g.h.v) {
			drawPixel(`${g.h.m[0]}`, (canvasWidth - `${g.h.m[0]}`.length * 55) / 2, 125, 15);
			drawPixel(`${g.h.m[1]}`, (canvasWidth - `${g.h.m[1]}`.length * 60) / 2, 225, 15);
			drawPixel(`${g.h.m[2]}`, (canvasWidth - `${g.h.m[2]}`.length * 56) / 2, 325, 15);
		}

		if (g.m.v) {
			drawPixel(`${g.m.l[0].m}`, (canvasWidth - `${g.m.l[0].m}`.length * 40) / 2, 475, 10, g.m.l[0].s ? '#FEDA94' : undefined);
			drawPixel(`${g.m.l[1].m}`, (canvasWidth - `${g.m.l[1].m}`.length * 40) / 2, 575, 10, g.m.l[1].s ? '#FEDA94' : undefined);
		}

		if (g.i.v) {
			drawPixel(`your planet is under threat as the asteroids`, 20, 455);
			drawPixel(`are approaching with uncertain speed. your`, 20, 485);
			drawPixel(`mission is to destroy them all before`, 20, 515);
			drawPixel(`your battery is drained out completely and`, 20, 545);
			drawPixel(`making you offline permanently.`, 20, 575);
			drawPixel(`survival tip`, 20, 615, 4);
			drawPixel(`look for golden stars to recharge battery.`, 20, 645);

			drawPixel(`controls`, 675, 455, 4);
			drawPixel(`arrow keys`, 675, 495);
			drawPixel(`move`, 835, 495);
			drawPixel(`space`, 675, 525);
			drawPixel(`shoot`, 835, 525);
			drawPixel(`p`, 675, 555);
			drawPixel(`pause/resume`, 835, 555);
			drawPixel(`enter`, 675, 585);
			drawPixel(`confirm`, 835, 585);
		}

		if (g.c.v) {
			drawPixel(`${g.c.m}`, (canvasWidth - `${g.c.m}`.length * 40) / 2, 235, 10);
			drawPixel(`${roundInteger(g.c.t)}`, (canvasWidth - `${roundInteger(g.c.t)}`.length * 50) / 2, 305, 20);
		}

		if (g.s.v) {
			drawPixel(`${g.s.m}`, (canvasWidth - `${g.s.m}`.length * 20) / 2, 255, 5);
			drawPixel(`${roundInteger(g.s.t)}`, (canvasWidth - `${roundInteger(g.s.t)}`.length * 50) / 2, 305, 10);
		}

		if (g.o.v) {
			drawPixel(`${g.o.m}`, (canvasWidth - `${g.o.m}`.length * 64) / 2, 275, 15);
		}

		if (g.t.v) {
			drawPixel(`${g.t.m[g.t.i]}`, 130 - (`${g.t.m[g.t.i]}`.length * 20) / 2, 15, 5);
		}
	}

	let lp = kn.gameLoop({
		fps: 60,
		update() {
			let i, j;

			[].concat(...[player], ...ss, ...asteroids, ...bullets, ...[battery]).map((sr) => {
				sr?.update();
			});

			for (i = 0; i < asteroids.length; i++) {
				for (j = 0; j < bullets.length; j++) {
					if (detectCollosion(bullets[j], asteroids[i])) {
						if (!--asteroids[i].power) {
							player.level += 1;
							sx.bhc.play();
						} else {
							sx.bhp.play();
							g.t.i = 0;
							g.t.v = 1;
							g.t.t = 2;
						}
						break;
					}
				}
				if (j !== bullets.length) {
					bullets.splice(j, 1);
					player.score += 50;
					break;
				}
				if (player?.collidesWith(asteroids[i]) && !g.s.v) {
					battery.percent -= asteroids[i].power * 10;
					player.x -= asteroids[i].power * 20;
					asteroids[i].power = 0;
					sx.php.play();
					sx.bhc.play();
					g.t.i = 1;
					g.t.v = 1;
					g.t.t = 2;
					break;
				}
			}

			if (i !== asteroids.length && asteroids[i].power === 0) {
				asteroids.splice(i, 1);
			}

			for (i = 0; i < bullets.length; i++) {
				if (bullets[i].x >= canvasWidth) {
					break;
				}
			}
			bullets.splice(i, 1);

			for (i = 0; i < ss.length; i++) {
				if (player?.collidesWith(ss[i]) && ss[i].p && battery.percent > 0) {
					sx.pw.play();
					battery.percent += ss[i].s;
					break;
				}
			}
			ss.splice(i, 1);
			if (player) {
				if (player.score > player.hiScore) {
					player.hiScore = player.score;
				}

				if (player.score >= fls) {
					player.score = 0;
					player.hiScore = fls;
				}

				if (player.level >= ls[l - 1].ta) {
					if (l < ml) {
						l += 1;
						player.level = 0;
						g.t.i = 2;
						g.t.v = 1;
						g.t.t = 2;
						sx.lu.play();
						unsetGameIntervals();
						setGameIntervals();
					} else {
						if (player.level === fla) {
							player.level = 0;
						}
					}
				}
			}

			if (battery.percent <= 0 && player.alive) {
				endGame();
			}

			if (g.s.v) {
				if (roundInteger(g.s.t) >= 0) {
					g.s.t -= 1 / 60;
				} else {
					g.s.v = 0;
				}
			}

			if (g.c.v) {
				localStorage.setItem('hiScore', player.hiScore);
				if (roundInteger(g.c.t) >= 0) {
					g.c.t -= 1 / 60;
				} else {
					g.c.v = 0;
					g.o.v = 1;
				}

				if (keyPressed('enter')) {
					sx.rs.play();
					g.s.t = 3;
					g.c.t = 9;
					g.c.v = 0;
					player.score = 0;
					battery.percent = 100;
					startGame();
				}
			}

			if (g.o.v) {
				if (roundInteger(g.o.t) >= 0) {
					g.o.t -= 1 / 60;
				} else {
					resetGame();
				}
			}

			if (g.m.v) {
				g.m.dt += 1 / 60;
				if ((keyPressed('up') || keyPressed('down')) && g.m.dt > 0.25) {
					sx.sl.play();
					g.m.l[0].s = !g.m.l[0].s;
					g.m.l[1].s = !g.m.l[1].s;
					g.m.dt = 0;
				}

				if (keyPressed('enter') && g.m.dt > 0.25) {
					g.m.dt = 0;
					g.m.v = 0;
					if (g.m.l[0].s) {
						g.h.v = 0;
						startGame();
					} else {
						g.i.v = 1;
					}
				}
			}

			if (g.i.v) {
				g.m.dt += 1 / 60;
				if (keyPressed('enter') && g.m.dt > 0.25) {
					g.i.v = 0;
					g.m.v = 1;
					g.m.dt = 0;
				}
			}

			if (g.t.v) {
				g.t.t -= 1 / 60;
				if (roundInteger(g.t.t) <= 0) {
					g.t.v = 0;
				}
			}

			if (!g.h.v && !g.m.v && !g.i.v && !g.s.v) {
				battery.percent -= 1 / 120;
			}
		},
		render() {
			renderBackground();
			[].concat(...ss, ...[player], ...asteroids, ...bullets, ...[battery]).map((sr) => {
				sr?.render();
			});
			renderTexts();
		},
	});

	let ii = null;

	createStars(bsz);
	lp.start();

	// Reset Game
	function resetGame() {
		asteroids.length = 0;
		ss.length = bsz;
		g.o.v = 0;
		g.m.v = 1;
		g.h.v = 1;
		player.level = 0;
		player.score = 0;
		l = 1;
		battery.percent = 100;
		g.c.t = 9;
		g.o.t = 3;
		g.s.t = 3;
	}

	// Start Game
	function startGame() {
		g.s.v = 1;
		player.x = -canvasWidth;
		player.y = 80;
		player.alive = 1;
		setGameIntervals();
		kn.keys.bind('p', () => {
			if (!lp.isStopped) {
				lp.stop();
				unsetGameIntervals();
			} else {
				lp.start();
				setGameIntervals();
			}
		});
	}
})();
