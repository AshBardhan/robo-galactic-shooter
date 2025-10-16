import type {Sprite} from 'kontra';
import {gameScreen, levels, maxLevel} from './constants/game';
import {chrs} from './constants/pixel';
import {roundInteger} from './utils/number';

export function renderBackground(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const g = context.createLinearGradient(canvas.width / 2, 0, canvas.width / 2, canvas.height);
  const ga = g.addColorStop.bind(g);
  ga(0.3, '#101014');
  ga(0.7, '#141852');
  ga(1, '#35274E');
  context.fillStyle = g;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawPixel(context: CanvasRenderingContext2D, str: string, dx = 0, dy = 0, size = 3, color = '#fff') {
  const needed = [];
  str = str.toUpperCase();
  for (let i = 0; i < str.length; i++) {
    const ch = chrs[str.charAt(i)];
    if (ch) {
      needed.push(ch);
    }
  }

  context.translate(dx, dy);
  context.beginPath();
  context.fillStyle = color;
  let currX = 0;
  needed.forEach((ch) => {
    let currY = 0;
    let addX = 0;
    for (let y = 0; y < ch.length; y++) {
      const row = ch[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x]) {
          context.fillRect(currX + x * size, currY, size, size);
        }
      }
      addX = Math.max(addX, row.length * size);
      currY += size;
    }
    currX += size + addX;
  });
  context.closePath();
  context.resetTransform();
}

export function renderTexts(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Sprite, currentLevel: number) {
  drawPixel(context, `Level`, 280, 10);
  drawPixel(context, `${currentLevel}/${maxLevel}`, 380, 10);
  drawPixel(context, `Target`, 280, 35);
  drawPixel(context, `${player?.currentTarget ?? 0}/${levels[currentLevel - 1].target}`, 380, 35);

  drawPixel(context, `Score`, 550, 10);
  drawPixel(context, `${player?.score ?? 0}`, 680, 10);
  drawPixel(context, `Hi-Score`, 550, 35);
  drawPixel(context, `${player?.hiScore ?? 0}`, 680, 35);

  if (gameScreen.heading.visible) {
    drawPixel(context, `${gameScreen.heading.messages[0]}`, (canvas.width - `${gameScreen.heading.messages[0]}`.length * 55) / 2, 125, 15);
    drawPixel(context, `${gameScreen.heading.messages[1]}`, (canvas.width - `${gameScreen.heading.messages[1]}`.length * 60) / 2, 225, 15);
    drawPixel(context, `${gameScreen.heading.messages[2]}`, (canvas.width - `${gameScreen.heading.messages[2]}`.length * 56) / 2, 325, 15);
  }

  if (gameScreen.menu.visible) {
    drawPixel(
      context,
      `${gameScreen.menu.options[0].message}`,
      (canvas.width - `${gameScreen.menu.options[0].message}`.length * 40) / 2,
      475,
      10,
      gameScreen.menu.options[0].selected ? '#FEDA94' : undefined
    );
    drawPixel(
      context,
      `${gameScreen.menu.options[1].message}`,
      (canvas.width - `${gameScreen.menu.options[1].message}`.length * 40) / 2,
      575,
      10,
      gameScreen.menu.options[1].selected ? '#FEDA94' : undefined
    );
  }

  if (gameScreen.instructions.visible) {
    drawPixel(context, `your planet is under threat as the asteroids`, 20, 455);
    drawPixel(context, `are approaching with uncertain speed. your`, 20, 485);
    drawPixel(context, `mission is to destroy them all before`, 20, 515);
    drawPixel(context, `your battery is drained out completely and`, 20, 545);
    drawPixel(context, `making you offline permanently.`, 20, 575);
    drawPixel(context, `survival tip`, 20, 615, 4);
    drawPixel(context, `look for golden stars to recharge battery.`, 20, 645);

    drawPixel(context, `controls`, 675, 455, 4);
    drawPixel(context, `arrow keys`, 675, 495);
    drawPixel(context, `move`, 835, 495);
    drawPixel(context, `space`, 675, 525);
    drawPixel(context, `shoot`, 835, 525);
    drawPixel(context, `esc`, 675, 555);
    drawPixel(context, `pause/resume`, 835, 555);
    drawPixel(context, `enter`, 675, 585);
    drawPixel(context, `confirm`, 835, 585);
  }

  if (gameScreen.continue.visible) {
    drawPixel(context, `${gameScreen.continue.message}`, (canvas.width - `${gameScreen.continue.message}`.length * 40) / 2, 235, 10);
    drawPixel(context, `${roundInteger(gameScreen.continue.time)}`, (canvas.width - `${roundInteger(gameScreen.continue.time)}`.length * 50) / 2, 305, 20);
  }

  if (gameScreen.start.visible) {
    drawPixel(context, `${gameScreen.start.message}`, (canvas.width - `${gameScreen.start.message}`.length * 20) / 2, 255, 5);
    drawPixel(context, `${roundInteger(gameScreen.start.time)}`, (canvas.width - `${roundInteger(gameScreen.start.time)}`.length * 50) / 2, 305, 10);
  }

  if (gameScreen.end.visible) {
    drawPixel(context, `${gameScreen.end.message}`, (canvas.width - `${gameScreen.end.message}`.length * 64) / 2, 275, 15);
  }

  if (gameScreen.action.visible) {
    drawPixel(context, `${gameScreen.action.messages[gameScreen.action.index]}`, 130 - (`${gameScreen.action.messages[gameScreen.action.index]}`.length * 20) / 2, 15, 5);
  }
}
