/* eslint-disable import/prefer-default-export */

type Iterate = {
  (num: number):number[];
  <T>(num: number, el?:T):T[];
  (num: number, el?:unknown):unknown[];
};
export const iterate: Iterate = (num: number, el?:unknown) => {
  if (el !== undefined) {
    return Array(num).fill(el);
  }
  return Array(num).fill(0).map((e, i) => i);
};

let idGenerator = 0;
export const newID = () => {
  idGenerator += 1;
  return idGenerator;
};
