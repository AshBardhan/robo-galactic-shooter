// Generate random value between min and max, multiplied by factor
export const randomValue = (max: number, min: number = 0, factor: number = 1): number => {
  return Math.floor(Math.random() * (max - min) + min) * factor;
};

// Round number up to the nearest integer (always up, like Math.ceil)
export const roundInteger = (value: number): number => {
  return Math.ceil(value);
};
