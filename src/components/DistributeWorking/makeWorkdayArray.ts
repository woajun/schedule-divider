/* eslint-disable operator-assignment */
/* eslint-disable import/prefer-default-export */
import { iterate } from '../helper';

interface Props {
  // 총 근무자 수
  people: number,
  // 평일근로의 날짜 수
  weekdays: number,
  // 휴일근로 날짜 수
  weekends: number,
  // 교대근무수
  shifts: number,
  // 교대 당 근무인원
  perShift: number,
}

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

export const makeWorkdayArray = (p:Props) : number[][][] => {
  const weekday = distribute(p.weekdays * p.perShift, p.shifts, p.people);
  const weekend = distribute(p.weekends * p.perShift, p.shifts, p.people);
  return mergeWeek(weekday, weekend);
};
