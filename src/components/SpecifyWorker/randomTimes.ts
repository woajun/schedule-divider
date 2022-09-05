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
  // 교대 당 근무인원 예) [4,2] - 첫 번째 근무 4명, 두 번째 근무 2명
  shifts: number[],
}

// 일 수, 교대 당 근무인원 배열, 사람 수
const distribute = (date:number, shifts: number[], people: number) => {
// 교대 당 공 수
  const times = shifts.map((s) => date * s);
  console.log(times);
  // 1인당 할당량을 나누고 나머지를 더해서 배열을 만들어서 합치기
  const person = times.map((t) => t / people);
  console.log(person);
};

const mergeWeek = (arrA:number[][], arrB:number[][]) => {
  arrB.reverse();
  return iterate(arrA.length).map((i) => [arrA[i], arrB[i]]);
};

export const randomTimes = (p:Props) => {
  const weekday = distribute(p.weekdays, p.shifts, p.people);
  // const weekend = distribute(p.weekends, p.shifts, p.people);
  // return mergeWeek(weekday, weekend);
};
