/* eslint-disable operator-assignment */
/* eslint-disable import/prefer-default-export */
import { iterate, spliteToInt } from '../helper';

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

const mergeTimes = (target:number[][]) => {
// 가장 작은수 찾고
// 가장 큰 수 찾고
// 인덱스 합치고
// 인덱스 삭제하고
};

const distribute = (date:number, shifts: number[], people: number) => {
  const totalTimes = shifts.map((s) => date * s);
  const times = totalTimes.map((t) => spliteToInt(t, people));
  console.log('times', times);
  const apple = times.reduce((p, c, i) => {
    // p에서 마지막꺼를 찾자.
    if (i === 0) {
      p.push(c);
      return p;
    }
    // const prev = p[i - 1];
    // // prev에서 가장 큰수의 인덱스를 찾자.
    // const maxPrev = Math.max(...prev);
    // const maxIdx = prev.indexOf(maxPrev);
    // console.log('m', maxIdx);
    // // cur에서 가장 작은 수의 인덱스를 찾자.
    // const minCur = Math.min(...c);
    // const minIdx = c.indexOf(minCur);
    // console.log('min', minIdx);
    // // 가장 작은 수의 인덱스부터 끝까지 잘라서
    // const sliced = c.slice(minIdx);
    // // 가장 큰수의 인덱스에 넣는다.
    // const spliced = c.splice(maxIdx, sliced.length, ...sliced);
    // p.push(spliced);
    return p;
    // 그리고 합친다.
  }, [] as number[][]);
  console.log('apple', apple);
};

const mergeWeek = (arrA:number[][], arrB:number[][]) => {
  arrB.reverse();
  return iterate(arrA.length).map((i) => [arrA[i], arrB[i]]);
};

export const randomTimes = (p:Props) => {
  const weekday = distribute(p.weekdays, p.shifts, p.people);
  const weekend = distribute(p.weekends, p.shifts, p.people);
  // return mergeWeek(weekday, weekend);
};
