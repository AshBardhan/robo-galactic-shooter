export const randomValue = (end: number, start: number = 0, factor: number = 1): number => Math.floor(Math.random() * end + start) * factor;

export const roundInteger = (val: number): number => Math.ceil(val);
