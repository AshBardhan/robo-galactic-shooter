import {soundEffects} from '../constants/sound';

export const playSoundEffect = (soundType: string) => {
  soundEffects[soundType].play();
};
