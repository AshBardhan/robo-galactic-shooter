import {Sprite} from 'kontra';

// Extended sprite types with custom properties
export type BatterySprite = Sprite & {
  percent: number;
  colorCodes: string[];
  time: number;
  getColorIndex(): number;
  getColorCode(): string;
};

export type BulletSprite = Sprite & {
  dx: number;
};

export type AsteroidSprite = Sprite & {
  degree: number;
  spin: number;
  size: number;
  dx: number;
  colorCode: number;
  power: number;
};

export type StarSprite = Sprite & {
  size: number;
  a: number;
  da: number;
  hasPower: boolean;
  dx: number;
};

export type PlayerSprite = Sprite & {
  alive: number;
  dx: number;
  dy: number;
  dt: number;
  bdt: number;
  currentTarget: number;
  score: number;
  hiScore: number;
};
