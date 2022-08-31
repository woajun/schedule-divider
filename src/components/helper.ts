/* eslint-disable import/prefer-default-export */
export const iterate = (num: number, el?:unknown) => {
  if (el !== undefined) {
    return Array(num).fill(el);
  }
  return Array(num).fill(0).map((e, i) => i);
};
