export const gameScreen = {
  heading: {
    visible: true,
    messages: ['Robo', 'Galactic', 'Shooter'],
  },
  menu: {
    visible: true,
    dt: 0,
    options: [
      {
        message: 'Play Game',
        selected: true,
      },
      {
        message: 'Instructions',
        selected: false,
      },
    ],
  },
  instructions: {
    visible: false,
  },
  start: {
    visible: false,
    time: 3,
    message: 'start game',
  },
  action: {
    visible: false,
    time: 2,
    index: 0,
    messages: ['boom', 'ouch', 'level up'],
  },
  continue: {
    visible: false,
    time: 9,
    message: 'continue',
  },
  end: {
    visible: false,
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
