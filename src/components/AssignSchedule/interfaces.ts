import type { Worker } from '../../interfaces';

export interface Output {
  date: number,
  type: string,
  shifts: Array<Worker[]>,
}

export interface InnerOutput {
  date: number,
  type: string,
  shifts: Array<number[]>,
}
