export interface Day {
  date: number,
  weekday: number,
  type: 'work' | 'holiday' | 'disabled' | string,
}
