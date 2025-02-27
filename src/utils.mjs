export const randomValue = (end, start = 0, factor = 1) => Math.floor(Math.random() * end + start) * factor;
export const roundInteger = (val) => Math.ceil(val);
