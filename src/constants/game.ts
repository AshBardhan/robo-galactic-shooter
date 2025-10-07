export const gameScreen = {
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

export const maxLevel = 50;
export const levels = [...Array(maxLevel)].map((_, i) => ({
  time: Math.ceil((maxLevel - i) / 5) * 250,
  asteroidFrequency: (i % 5) + 2,
  target: (i + 1) * 5,
  asteroidLimit: Math.ceil((i + 1) / 5) * 20,
  starFrequency: (i % 5) + 1,
  starLimit: i + 5,
}));

export const maxScoreToFlip = 9999999999;
export const maxTargetToFlip = 99999;

export const angleRadianRatio = Math.PI / 180;
export const FRAME_RATE = 60;
