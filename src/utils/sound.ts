import {soundEffects, type SoundType} from '../constants/sound';

export const playSoundEffect = (soundType: SoundType): void => {
  soundEffects[soundType].play();
};
