/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */

type Iterate = {
  (num: number):number[];
  <T>(num: number, fill?:T):T[];
  (num: number, fill?:unknown):unknown[];
};
export const iterate: Iterate = (num: number, fill?:unknown) => {
  if (fill !== undefined) {
    return Array(num).fill(fill);
  }
  return Array(num).fill(0).map((e, i) => i);
};

let idGenerator = 0;
export const newID = () => {
  idGenerator += 1;
  return idGenerator;
};

export function shuffle<T>(rawArr:Array<T>):Array<T> {
  const arr = JSON.parse(JSON.stringify(rawArr));
  let i = arr.length;
  let randomI : number;

  while (i !== 0) {
    randomI = Math.floor(Math.random() * i);
    i--;

    // eslint-disable-next-line no-param-reassign
    [arr[i], arr[randomI]] = [arr[randomI], arr[i]];
  }
  return arr;
}

export function deepcopy<T>(target:Array<T>):Array<T> {
  return JSON.parse(JSON.stringify(target));
}
