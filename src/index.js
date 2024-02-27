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
	let gameInterval = null;
	let gameLoop;

	// Check Collision  between two objects 'o1' and 'o2'
	function detectCollosion(o1, o2) {
		return o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y;
	}

	function randomValue(end, start = 0, factor = 1) {
		return Math.floor(Math.random() * end + start) * factor;
	}

	// Prints string text in pixelated form
	function drawPixel(str, dx = 0, dy = 0, size = 3, color = '#fff') {
		let needed = [];
		let i, x, y, ch;
		str = str.toUpperCase();
		for (i = 0; i < str.length; i++) {
			ch = chrs[str.charAt(i)];
			if (ch) {
				needed.push(ch);
			}
		}

		ctx.translate(dx, dy);
		ctx.beginPath();
		ctx.fillStyle = color;
		let currX = 0;
		for (i = 0; i < needed.length; i++) {
			ch = needed[i];
			let currY = 0;
			let addX = 0;
			for (y = 0; y < ch.length; y++) {
				let row = ch[y];
				for (x = 0; x < row.length; x++) {
					if (row[x]) {
						ctx.fillRect(currX + x * size, currY, size, size);
					}
				}
				addX = Math.max(addX, row.length * size);
				currY += size;
			}
			currX += size + addX;
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
	let stars = [];
	const backgroundStarCount = 100;

	// Bullets
	let bullets = [];

	// Levels
	let levels = [];
	const maxLevel = 50;
	let currentLevel = 1;

	// Flipping Score and Asteroid Hit
	const flip = {
		maxScore: 9999999999,
		maxHit: 99999,
	};

	// Initiate all level rules
	for (let i = 0; i < maxLevel; i++) {
		levels.push({
			time: Math.ceil((maxLevel - i) / 5) * 250,
			asteroidFrequency: (i % 5) + 2,
			target: (i + 1) * 5,
			asteroidLimit: Math.ceil((i + 1) / 5) * 20,
			starFrequency: (i % 5) + 1,
			starLimit: i + 5,
		});
	}

	// Generate 'Battery' sprites
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

	// Generate 'Bullet' sprites
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

	// Generate 'Player' sprites
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
			hit: 0,
			score: 0,
			hiScore: localStorage.getItem('hiScore') || 0,
			update() {
				if (!gamePlay.menu.visible) {
					if (this.alive) {
						this.bdt += 1 / 60;
						if (keyPressed('left') && this.x >= 0 && !gamePlay.start.visible) {
							this.x -= this.dx;
						}
						if (keyPressed('right') && this.x + this.width <= (2 * canvasWidth) / 3 && !gamePlay.start.visible) {
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
				if (gamePlay.start.visible) {
					this.x += this.dx;
				}
			},
		});
	};

	// Generate 'Asteroid' sprites
	function createAsteroids(count) {
		if (count === 0 || asteroids.length === levels[currentLevel - 1].asteroidLimit) {
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

		createAsteroids(count - 1);
	}

	// Generate 'Star' sprites
	function createStars(count, hasPower = false) {
		if (count === 0 || stars.length === levels[currentLevel - 1].starLimit + backgroundStarCount) {
			return;
		}
		let star = sprite({
			x: canvasWidth + randomValue(55, 0, 20),
			y: randomValue(25, 3, 25),
			size: 20, // Size
			a: 0, // Alpha/Opacity
			da: 2,
			hasPower,
			dx: 10,
			update() {
				if (this.hasPower) {
					this.a += this.da;
					if (this.a >= 150 || this.a <= 0) {
						this.da *= -1;
					}
				}
				this.x -= this.hasPower ? (this.dx * 3) / 2 : this.dx;

				if (this.x <= -this.size) {
					this.x = canvasWidth;
				}
			},
			render() {
				let renderSize = this.hasPower ? this.size : this.size / 2;
				ctx.translate(this.x, this.y);
				ctx.beginPath();
				ctx.fillStyle = this.hasPower ? '#ffcf40' : '#fff';
				ctx.ellipse(renderSize, renderSize, 1, renderSize, 0, 0, tp);
				ctx.ellipse(renderSize, renderSize, 1, renderSize, angleRadianRatio * 90, 0, tp);
				ctx.fill();
				ctx.closePath();
				if (this.hasPower) {
					ctx.beginPath();
					ctx.fillStyle = `rgba(255,207,64,${this.a / 255})`;
					ctx.arc(renderSize, renderSize, (4 * renderSize) / 5, 0, tp);
					ctx.fill();
					ctx.closePath();
				}
				ctx.resetTransform();
			},
		});

		stars.push(star);
		createStars(count - 1);
	}

	// Unset game interval
	function unsetGameInterval() {
		clearInterval(gameInterval);
	}

	// Set game interval
	function setGameInterval() {
		gameInterval = setInterval(
			() => {
				createStars(levels[currentLevel - 1].starFrequency, true);
				createAsteroids(levels[currentLevel - 1].asteroidFrequency);
			},
			levels[currentLevel - 1].time
		);
	}

	// End game
	function endGame() {
		player.alive = 0;
		gamePlay.continue.visible = 1;
		unsetGameInterval();
		kn.keys.unbind('p');
	}

	function roundInteger(val) {
		return Math.ceil(val);
	}

	// Gameplay message map based on different sub-components of game
	let gamePlay = {
		heading: {
			visible: 1,
			messages: ['Robo', 'Galactic', 'Shooter'],
		},
		menu: {
			visible: 1,
			dt: 0,
			options: [
				{
					message: 'Play Game',
					selected: 1,
				},
				{
					message: 'Instructions',
					selected: 0,
				},
			],
		},
		instructions: {
			visible: 0,
		},
		start: {
			visible: 0,
			time: 3,
			message: 'start game',
		},
		action: {
			visible: 0,
			time: 2,
			index: 0,
			messages: ['boom', 'ouch', 'level up'],
		},
		continue: {
			visible: 0,
			time: 9,
			message: 'continue',
		},
		end: {
			visible: 0,
			time: 3,
			message: 'game over',
		},
	};

	// Render text based on different sub-components of game
	function renderTexts() {
		drawPixel(`Level`, 280, 10);
		drawPixel(`${currentLevel}/${maxLevel}`, 380, 10);
		drawPixel(`Target`, 280, 35);
		drawPixel(`${player?.hit ?? 0}/${levels[currentLevel - 1].target}`, 380, 35);

		drawPixel(`Score`, 550, 10);
		drawPixel(`${player?.score ?? 0}`, 680, 10);
		drawPixel(`Hi-Score`, 550, 35);
		drawPixel(`${player?.hiScore ?? 0}`, 680, 35);

		if (gamePlay.heading.visible) {
			drawPixel(`${gamePlay.heading.messages[0]}`, (canvasWidth - `${gamePlay.heading.messages[0]}`.length * 55) / 2, 125, 15);
			drawPixel(`${gamePlay.heading.messages[1]}`, (canvasWidth - `${gamePlay.heading.messages[1]}`.length * 60) / 2, 225, 15);
			drawPixel(`${gamePlay.heading.messages[2]}`, (canvasWidth - `${gamePlay.heading.messages[2]}`.length * 56) / 2, 325, 15);
		}

		if (gamePlay.menu.visible) {
			drawPixel(`${gamePlay.menu.options[0].message}`, (canvasWidth - `${gamePlay.menu.options[0].message}`.length * 40) / 2, 475, 10, gamePlay.menu.options[0].selected ? '#FEDA94' : undefined);
			drawPixel(`${gamePlay.menu.options[1].message}`, (canvasWidth - `${gamePlay.menu.options[1].message}`.length * 40) / 2, 575, 10, gamePlay.menu.options[1].selected ? '#FEDA94' : undefined);
		}

		if (gamePlay.instructions.visible) {
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

		if (gamePlay.continue.visible) {
			drawPixel(`${gamePlay.continue.message}`, (canvasWidth - `${gamePlay.continue.message}`.length * 40) / 2, 235, 10);
			drawPixel(`${roundInteger(gamePlay.continue.time)}`, (canvasWidth - `${roundInteger(gamePlay.continue.time)}`.length * 50) / 2, 305, 20);
		}

		if (gamePlay.start.visible) {
			drawPixel(`${gamePlay.start.message}`, (canvasWidth - `${gamePlay.start.message}`.length * 20) / 2, 255, 5);
			drawPixel(`${roundInteger(gamePlay.start.time)}`, (canvasWidth - `${roundInteger(gamePlay.start.time)}`.length * 50) / 2, 305, 10);
		}

		if (gamePlay.end.visible) {
			drawPixel(`${gamePlay.end.message}`, (canvasWidth - `${gamePlay.end.message}`.length * 64) / 2, 275, 15);
		}

		if (gamePlay.action.visible) {
			drawPixel(`${gamePlay.action.messages[gamePlay.action.index]}`, 130 - (`${gamePlay.action.messages[gamePlay.action.index]}`.length * 20) / 2, 15, 5);
		}
	}

	// Reset game once it is over
	function resetGame() {
		asteroids.length = 0;
		stars.length = backgroundStarCount;
		gamePlay.end.visible = 0;
		gamePlay.menu.visible = 1;
		gamePlay.heading.visible = 1;
		player.hit = 0;
		player.score = 0;
		currentLevel = 1;
		battery.percent = 100;
		gamePlay.continue.time = 9;
		gamePlay.end.time = 3;
		gamePlay.start.time = 3;
	}

	// Start game
	function startGame() {
		gamePlay.start.visible = 1;
		player.x = -canvasWidth;
		player.y = 80;
		player.alive = 1;
		setGameInterval();
		kn.keys.bind('p', () => {
			if (!gameLoop.isStopped) {
				gameLoop.stop();
				unsetGameInterval();
			} else {
				gameLoop.start();
				setGameInterval();
			}
		});
	}

	gameLoop = kn.gameLoop({
		fps: 60,
		update() {
			let i, j;

			[].concat(...[player], ...stars, ...asteroids, ...bullets, ...[battery]).map((sr) => {
				sr?.update();
			});

			for (i = 0; i < asteroids.length; i++) {
				for (j = 0; j < bullets.length; j++) {
					if (detectCollosion(bullets[j], asteroids[i])) {
						if (!--asteroids[i].power) {
							player.hit += 1;
							sx.bhc.play();
						} else {
							sx.bhp.play();
							gamePlay.action.index = 0;
							gamePlay.action.visible = 1;
							gamePlay.action.time = 2;
						}
						break;
					}
				}
				if (j !== bullets.length) {
					bullets.splice(j, 1);
					player.score += 50;
					break;
				}
				if (player?.collidesWith(asteroids[i]) && !gamePlay.start.visible) {
					battery.percent -= asteroids[i].power * 10;
					player.x -= asteroids[i].power * 20;
					asteroids[i].power = 0;
					sx.php.play();
					sx.bhc.play();
					gamePlay.action.index = 1;
					gamePlay.action.visible = 1;
					gamePlay.action.time = 2;
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

			for (i = 0; i < stars.length; i++) {
				if (player?.collidesWith(stars[i]) && stars[i].hasPower && battery.percent > 0) {
					sx.pw.play();
					battery.percent += stars[i].size;
					break;
				}
			}
			stars.splice(i, 1);
			if (player) {
				if (player.score > player.hiScore) {
					player.hiScore = player.score;
				}

				if (player.score >= flip.maxScore) {
					player.score = 0;
					player.hiScore = flip.maxScore;
				}

				if (player.hit >= levels[currentLevel - 1].target) {
					if (currentLevel < maxLevel) {
						currentLevel += 1;
						player.hit = 0;
						gamePlay.action.index = 2;
						gamePlay.action.visible = 1;
						gamePlay.action.time = 2;
						sx.lu.play();
						unsetGameInterval();
						setGameInterval();
					} else {
						if (player.hit === flip.maxHit) {
							player.hit = 0;
						}
					}
				}
			}

			if (battery.percent <= 0 && player.alive) {
				endGame();
			}

			if (gamePlay.start.visible) {
				if (roundInteger(gamePlay.start.time) >= 0) {
					gamePlay.start.time -= 1 / 60;
				} else {
					gamePlay.start.visible = 0;
				}
			}

			if (gamePlay.continue.visible) {
				localStorage.setItem('hiScore', player.hiScore);
				if (roundInteger(gamePlay.continue.time) >= 0) {
					gamePlay.continue.time -= 1 / 60;
				} else {
					gamePlay.continue.visible = 0;
					gamePlay.end.visible = 1;
				}

				if (keyPressed('enter')) {
					sx.rs.play();
					gamePlay.start.time = 3;
					gamePlay.continue.time = 9;
					gamePlay.continue.visible = 0;
					player.score = 0;
					battery.percent = 100;
					startGame();
				}
			}

			if (gamePlay.end.visible) {
				if (roundInteger(gamePlay.end.time) >= 0) {
					gamePlay.end.time -= 1 / 60;
				} else {
					resetGame();
				}
			}

			if (gamePlay.menu.visible) {
				gamePlay.menu.dt += 1 / 60;
				if ((keyPressed('up') || keyPressed('down')) && gamePlay.menu.dt > 0.25) {
					sx.sl.play();
					gamePlay.menu.options[0].selected = !gamePlay.menu.options[0].selected;
					gamePlay.menu.options[1].selected = !gamePlay.menu.options[1].selected;
					gamePlay.menu.dt = 0;
				}

				if (keyPressed('enter') && gamePlay.menu.dt > 0.25) {
					gamePlay.menu.dt = 0;
					gamePlay.menu.visible = 0;
					if (gamePlay.menu.options[0].selected) {
						gamePlay.heading.visible = 0;
						startGame();
					} else {
						gamePlay.instructions.visible = 1;
					}
				}
			}

			if (gamePlay.instructions.visible) {
				gamePlay.menu.dt += 1 / 60;
				if (keyPressed('enter') && gamePlay.menu.dt > 0.25) {
					gamePlay.instructions.visible = 0;
					gamePlay.menu.visible = 1;
					gamePlay.menu.dt = 0;
				}
			}

			if (gamePlay.action.visible) {
				gamePlay.action.time -= 1 / 60;
				if (roundInteger(gamePlay.action.time) <= 0) {
					gamePlay.action.visible = 0;
				}
			}

			if (!gamePlay.heading.visible && !gamePlay.menu.visible && !gamePlay.instructions.visible && !gamePlay.start.visible) {
				battery.percent -= 1 / 120;
			}
		},
		render() {
			renderBackground();
			[].concat(...stars, ...[player], ...asteroids, ...bullets, ...[battery]).map((sr) => {
				sr?.render();
			});
			renderTexts();
		},
	});

	createStars(backgroundStarCount);
	gameLoop.start();
})();
