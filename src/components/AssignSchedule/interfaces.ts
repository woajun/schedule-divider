import type { Worker } from '../../interfaces';

export interface Output {
  date: number,
  shifts: Array<Worker[]>,
}

export interface InnerOutput {
  date: number,
  shifts: Array<number[]>,
}
