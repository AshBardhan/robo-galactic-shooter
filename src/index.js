import './lib/sfxr.mjs';
import {init, Sprite, GameLoop, initKeys, keyPressed, collides, offKey, onKey} from './lib/kontra.min.mjs';
import {soundEffects, soundTypes} from './constants/sound.mjs';
import {levels, maxLevel, maxScoreToFlip, maxTargetToFlip, gameScreen} from './constants/game.mjs';
import {renderBackground, renderTexts} from './render.mjs';
import {randomValue, roundInteger} from './utils.mjs';

const angleRadianRatio = Math.PI / 180;
const FRAME_RATE = 60;

let {canvas, context} = init();
initKeys();

let gameInterval = null;
let gameLoop;

let playSoundEffect = (soundType) => {
	soundEffects[soundType].play();
};

// Asteroids
let asteroids = [];

// Stars
let stars = [];
const backgroundStarCount = 100;

// Bullets
let bullets = [];

// Levels

let currentLevel = 1;

// Generate 'Battery' sprite
let battery = Sprite({
	x: canvas.width - 100,
	y: 15,
	width: 50,
	height: 30,
	percent: 100,
	colorCodes: ['#05A84E', '#FE251D', '#F7C808'],
	time: 1,
	getColorIndex() {
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

		console.log('battery percent', this.percent);
	},
	render() {
		if (roundInteger(this.time) > 0) {
			console.log('battery rendering', this.time, context, this.y);
			context.beginPath();
			context.strokeStyle = '#fff';
			context.fillStyle = '#fff';
			context.lineWidth = 4;
			context.strokeRect(0, 0, this.width, this.height);
			context.fillRect(this.width + 4, this.height / 2 - 10, 4, 20);
			context.closePath();
			context.beginPath();
			context.fillStyle = this.getColorCode();
			context.fillRect(2, 2, (this.percent / 100) * (this.width - 4), this.height - 4);
			context.closePath();
			context.resetTransform();
		}
	},
});

// Generate 'Bullet' sprites
function createBullet(player) {
	let bullet;
	let bulletImage = new Image();
	bulletImage.src = './assets/bullet.svg';
	bulletImage.onload = function () {
		bullet = Sprite({
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

// Generate 'Player' sprite
let player;
let playerImage = new Image();
playerImage.src = './assets/player.svg';
playerImage.onload = function () {
	player = Sprite({
		x: -canvas.width,
		y: 80,
		width: 120,
		height: 60,
		image: playerImage,
		alive: 0,
		dx: 5,
		dy: 2,
		dt: 0,
		bdt: 0,
		currentTarget: 0,
		score: 0,
		hiScore: localStorage.getItem('hiScore') || 0,
		update() {
			if (!gameScreen.menu.visible) {
				if (this.alive) {
					this.bdt += 1 / FRAME_RATE;
					if (keyPressed('arrowleft') && this.x >= 0 && !gameScreen.start.visible) {
						this.x -= this.dx;
					}
					if (keyPressed('arrowright') && this.x + this.width <= (2 * canvas.width) / 3 && !gameScreen.start.visible) {
						this.x += this.dx;
					}
					if (keyPressed('arrowup') && this.y >= 50) {
						this.y -= this.dy;
					}
					if (keyPressed('arrowdown') && this.y + this.height <= canvas.height) {
						this.y += this.dy;
					}
					if (keyPressed('space') && this.bdt > 0.1) {
						playSoundEffect(soundTypes.SHOOT);
						this.bdt = 0;
						createBullet(this);
					}
				} else {
					this.bdt = 0;
					this.y += 10;
				}
			}
			if (gameScreen.start.visible) {
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
	asteroidImage.src = './assets/asteroid.svg';
	asteroidImage.onload = function () {
		asteroid = Sprite({
			x: 2 * canvas.width,
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
					this.x = canvas.width;
				}

				this.degree -= this.spin;
			},
			render() {
				context.translate(this.width / 2, this.height / 2);
				context.rotate(this.degree * angleRadianRatio);
				let renderSize = (this.power * 25) / 100;
				context.scale(renderSize, renderSize);
				context.translate(-(this.width / 2), -(this.height / 2));
				context.beginPath();
				context.filter = `hue-rotate(${this.colorCode}deg)`;
				this.draw();
				context.filter = 'none';
				context.resetTransform();
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
	let star = Sprite({
		x: canvas.width + randomValue(55, 0, 20),
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
				this.x = canvas.width;
			}
		},
		render() {
			let renderSize = this.hasPower ? this.size : this.size / 2;
			context.translate(this.x, this.y);
			context.beginPath();
			context.fillStyle = this.hasPower ? '#ffcf40' : '#fff';
			context.ellipse(renderSize, renderSize, 1, renderSize, 0, 0, 2 * Math.PI);
			context.ellipse(renderSize, renderSize, 1, renderSize, angleRadianRatio * 90, 0, 2 * Math.PI);
			context.fill();
			context.closePath();
			if (this.hasPower) {
				context.beginPath();
				context.fillStyle = `rgba(255,207,64,${this.a / 255})`;
				context.arc(renderSize, renderSize, (4 * renderSize) / 5, 0, 2 * Math.PI);
				context.fill();
				context.closePath();
			}
			context.resetTransform();
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
	gameScreen.continue.visible = 1;
	unsetGameInterval();
	offKey('esc');
}

// Reset game once it is over
function resetGame() {
	asteroids.length = 0;
	stars.length = backgroundStarCount;
	gameScreen.end.visible = 0;
	gameScreen.menu.visible = 1;
	gameScreen.heading.visible = 1;
	player.currentTarget = 0;
	player.score = 0;
	currentLevel = 1;
	battery.percent = 100;
	gameScreen.continue.time = 9;
	gameScreen.end.time = 3;
	gameScreen.start.time = 3;
}

// Start game
function startGame() {
	gameScreen.start.visible = 1;
	player.x = -canvas.width;
	player.y = 80;
	player.alive = 1;
	setGameInterval();
	// Toggle 'p' key to pause and resume the game
	onKey('esc', () => {
		if (!gameLoop.isStopped) {
			gameLoop.stop();
			unsetGameInterval();
		} else {
			gameLoop.start();
			setGameInterval();
		}
	});
}

// Game loop that update and renders the game every frame
gameLoop = GameLoop({
	fps: 60,
	update() {
		let i, j;

		[].concat(...[player], ...stars, ...asteroids, ...bullets, ...[battery]).map((sr) => {
			sr?.update();
		});

		for (i = 0; i < asteroids.length; i++) {
			for (j = 0; j < bullets.length; j++) {
				// Check if the bullet has hit any incoming asteroid
				if (collides(bullets[j], asteroids[i])) {
					if (!--asteroids[i].power) {
						player.currentTarget += 1;
						playSoundEffect(soundTypes.ASTEROID_DESTORY);
					} else {
						playSoundEffect(soundTypes.BULLET_HIT);
						gameScreen.action.index = 0;
						gameScreen.action.visible = 1;
						gameScreen.action.time = 2;
					}
					break;
				}
			}
			// Update player's score once the bullet has hit the asteroid
			if (j !== bullets.length) {
				bullets.splice(j, 1);
				player.score += 50;
				break;
			}
			// Check if the player has hit any incoming asteroid
			if (!gameScreen.start.visible && collides(player, asteroids[i])) {
				battery.percent -= asteroids[i].power * 10;
				player.x -= asteroids[i].power * 20;
				asteroids[i].power = 0;
				playSoundEffect(soundTypes.PLAYER_HIT);
				playSoundEffect(soundTypes.ASTEROID_DESTORY);
				gameScreen.action.index = 1;
				gameScreen.action.visible = 1;
				gameScreen.action.time = 2;
				break;
			}
		}

		// Destroy the asteroid once it is hit by the bullet or the player
		if (i !== asteroids.length && asteroids[i].power === 0) {
			asteroids.splice(i, 1);
		}

		// Destroy the bullet once it has reached beyond the canvas screen
		for (i = 0; i < bullets.length; i++) {
			if (bullets[i].x >= canvas.width) {
				break;
			}
		}
		bullets.splice(i, 1);

		// Check if the player has consumed any incoming golden power star
		for (i = 0; i < stars.length; i++) {
			if (collides(stars[i], player) && stars[i].hasPower && battery.percent > 0) {
				playSoundEffect(soundTypes.POWER);
				battery.percent += stars[i].size;
				break;
			}
		}
		// Destroy the golden power star once it is consumed by the player
		stars.splice(i, 1);

		if (player) {
			if (player.score > player.hiScore) {
				player.hiScore = player.score;
			}
			// Flip the player's score to zero once it has reached to maximum score
			if (player.score >= maxScoreToFlip) {
				player.score = 0;
				player.hiScore = maxScoreToFlip;
			}

			// Update player's level once it has hit the required target amount
			if (player.currentTarget >= levels[currentLevel - 1].target) {
				if (currentLevel < maxLevel) {
					currentLevel += 1;
					player.currentTarget = 0;
					gameScreen.action.index = 2;
					gameScreen.action.visible = 1;
					gameScreen.action.time = 2;
					playSoundEffect(soundTypes.LEVEL_UP);
					unsetGameInterval();
					setGameInterval();
				} else {
					// Flip the player's target amount to zero once it has reached to maximum value
					if (player.currentTarget === maxTargetToFlip) {
						player.currentTarget = 0;
					}
				}
			}
		}

		// End the game once the player's power level drops to zero
		if (battery.percent <= 0 && player.alive) {
			endGame();
		}

		// Show 'Start Game' countdown view
		if (gameScreen.start.visible) {
			if (roundInteger(gameScreen.start.time) >= 0) {
				gameScreen.start.time -= 1 / FRAME_RATE;
			} else {
				gameScreen.start.visible = 0;
			}
		}

		// Show 'Continue' countdown view which allow player to revive
		if (gameScreen.continue.visible) {
			localStorage.setItem('hiScore', player.hiScore);
			if (roundInteger(gameScreen.continue.time) >= 0) {
				gameScreen.continue.time -= 1 / FRAME_RATE;
			} else {
				gameScreen.continue.visible = 0;
				gameScreen.end.visible = 1;
			}
			// Restart the game once the player has pressed 'Enter' to continue the game
			if (keyPressed('enter')) {
				playSoundEffect(soundTypes.REVIVE);
				gameScreen.start.time = 3;
				gameScreen.continue.time = 9;
				gameScreen.continue.visible = 0;
				player.score = 0;
				battery.percent = 100;
				startGame();
			}
		}

		// Show 'Game Over' view
		if (gameScreen.end.visible) {
			if (roundInteger(gameScreen.end.time) >= 0) {
				gameScreen.end.time -= 1 / FRAME_RATE;
			} else {
				resetGame();
			}
		}

		// Show 'Game Menu' view to choose either play game or view instructions
		if (gameScreen.menu.visible) {
			gameScreen.menu.dt += 1 / FRAME_RATE;
			if ((keyPressed('arrowup') || keyPressed('arrowdown')) && gameScreen.menu.dt > 0.25) {
				playSoundEffect(soundTypes.SELECT);
				gameScreen.menu.options[0].selected = !gameScreen.menu.options[0].selected;
				gameScreen.menu.options[1].selected = !gameScreen.menu.options[1].selected;
				gameScreen.menu.dt = 0;
			}
			if (keyPressed('enter') && gameScreen.menu.dt > 0.25) {
				gameScreen.menu.dt = 0;
				gameScreen.menu.visible = 0;
				if (gameScreen.menu.options[0].selected) {
					gameScreen.heading.visible = 0;
					startGame();
				} else {
					gameScreen.instructions.visible = 1;
				}
			}
		}

		// Show 'Instructions' view
		if (gameScreen.instructions.visible) {
			gameScreen.menu.dt += 1 / FRAME_RATE;
			if (keyPressed('enter') && gameScreen.menu.dt > 0.25) {
				gameScreen.instructions.visible = 0;
				gameScreen.menu.visible = 1;
				gameScreen.menu.dt = 0;
			}
		}

		// Show 'action' text view based on certain conditions
		if (gameScreen.action.visible) {
			gameScreen.action.time -= 1 / FRAME_RATE;
			if (roundInteger(gameScreen.action.time) <= 0) {
				gameScreen.action.visible = 0;
			}
		}

		// Decrease player's power level in small amount during the game
		if (!gameScreen.heading.visible && !gameScreen.menu.visible && !gameScreen.instructions.visible && !gameScreen.start.visible) {
			battery.percent -= 1 / (2 * FRAME_RATE);
		}
	},
	render() {
		renderBackground(context, canvas);
		[].concat(...stars, ...[player], ...asteroids, ...bullets, ...[battery]).map((sr) => {
			sr?.render();
		});
		renderTexts(context, canvas, player, currentLevel);
	},
});

createStars(backgroundStarCount);
gameLoop.start();
