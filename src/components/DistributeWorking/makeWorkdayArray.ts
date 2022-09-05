/* eslint-disable operator-assignment */
/* eslint-disable import/prefer-default-export */
import { iterate } from '../helper';

const distribute = (date:number, shifts: number, people: number) => {
  const el = Math.floor(date / people);
  const rest = date % people;
  const splitedDate = iterate(people, el);

  iterate(rest).forEach((i) => {
    splitedDate[i] = splitedDate[i] + 1;
  });

  const arrs = iterate(shifts).map(() => {
    const sliced = splitedDate.slice(rest);
    splitedDate.unshift(...sliced);
    splitedDate.splice(people);
    return splitedDate.map((e) => e);
  });

  return iterate(people).map((i) => arrs.map((e) => e[i]));
};

const mergeWeek = (arrA:number[][], arrB:number[][]) => {
  arrB.reverse();
  return iterate(arrA.length).map((i) => [arrA[i], arrB[i]]);
};

export const makeWorkdayArray = (
  people: number,
  wd: number,
  hd: number,
  shifts: number,
  perShift:number,
) : number[][][] => {
  const weekday = distribute(wd * perShift, shifts, people);
  const weekend = distribute(hd * perShift, shifts, people);
  return mergeWeek(weekday, weekend);
};
