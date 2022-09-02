export interface Output {
  date: number,
  shifts: Array<string[]>,
}

export interface InnerOutput {
  date: number,
  shifts: Array<number[]>,
}
