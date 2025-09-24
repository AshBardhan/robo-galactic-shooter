import {createBullet} from './index.js';
import {angleRadianRatio, FRAME_RATE, gameScreen} from './constants/game.mjs';
import {keyPressed, Sprite} from './lib/kontra.min.mjs';
import {playSoundEffect, randomValue, roundInteger} from './utils.mjs';
import {soundTypes} from './constants/sound.mjs';

export const createBatterySprite = (context, canvas) => {
  return Sprite({
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
    },
    render() {
      if (roundInteger(this.time) > 0) {
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
};

export const createBulletSprite = (player) => {
  return new Promise((resolve, _reject) => {
    let bulletImage = new Image();
    bulletImage.src = './assets/bullet.svg';
    bulletImage.onload = function () {
      const bullet = Sprite({
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
      resolve(bullet);
    };
  });
};

export const createAsteroidSprite = (context, canvas) => {
  return new Promise((resolve, _reject) => {
    let asteroidImage = new Image();
    asteroidImage.src = './assets/asteroid.svg';
    asteroidImage.onload = function () {
      const asteroid = Sprite({
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
      resolve(asteroid);
    };
  });
};

export const createStarSprite = (context, canvas, hasPower) => {
  return Sprite({
    x: canvas.width + randomValue(55, 0, 20),
    y: randomValue(25, 3, 25),
    size: 20,
    a: 0,
    da: 2,
    hasPower: hasPower,
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
};

export const createPlayerSprite = (canvas) => {
  return new Promise((resolve, _reject) => {
    let playerImage = new Image();
    playerImage.src = './assets/player.svg';
    playerImage.onload = function () {
      const player = Sprite({
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
      resolve(player);
    };
  });
};
