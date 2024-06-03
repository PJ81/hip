export const
  HUM = 1,
  COM = 0,
  NONE = -1,

  SCALE = 1,
  COUNT = 7,
  BRD = 20,
  SIZE = BRD + BRD * COUNT + BRD * (COUNT - 1),

  TWO_PI = Math.PI * 2,

  random = (i: number = 1, a?: number): number => {
    if (!a) return Math.random() * i;
    return Math.random() * (a - i) + i;
  },

  choose = (arr: any[]): any => {
    return arr[~~random(arr.length)];
  };