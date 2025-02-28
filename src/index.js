import './lib/sfxr.mjs';
import {init, GameLoop, initKeys, keyPressed, collides, offKey, onKey} from './lib/kontra.min.mjs';
import {soundTypes} from './constants/sound.mjs';
import {levels, maxLevel, maxScoreToFlip, maxTargetToFlip, gameScreen} from './constants/game.mjs';
import {renderBackground, renderTexts} from './render.mjs';
import {playSoundEffect, roundInteger} from './utils.mjs';
import {createAsteroidSprite, createBatterySprite, createBulletSprite, createPlayerSprite, createStarSprite} from './sprites.mjs';

const angleRadianRatio = Math.PI / 180;
const FRAME_RATE = 60;

let {canvas, context} = init();

initKeys();

let gameInterval = null;
let gameLoop;

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
let battery = createBatterySprite(context, canvas);

// Generate 'Bullet' sprites
export async function createBullet(player) {
	const bullet = await createBulletSprite(player);
	bullets.push(bullet);
}

// Generate 'Player' sprite
let player = await createPlayerSprite(canvas);

// Generate 'Asteroid' sprites
async function createAsteroids(count) {
	const asteroidLimit = levels[currentLevel - 1].asteroidLimit;
	while (count > 0 && asteroids.length < asteroidLimit) {
		const asteroid = await createAsteroidSprite(context, canvas);
		asteroids.push(asteroid);
		count--;
	}
}

// Generate 'Star' sprites
function createStars(count, hasPower = false) {
	const starLimit = levels[currentLevel - 1].starLimit + backgroundStarCount;
	while (count > 0 && stars.length < starLimit) {
		const star = createStarSprite(context, canvas, hasPower);
		stars.push(star);
		count--;
	}
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
