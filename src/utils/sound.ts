import {soundEffects} from '../constants/sound';

export const playSoundEffect = (soundType) => {
  soundEffects[soundType].play();
};
