export interface Day {
  date: number,
  weekday: number,
  type: 'work' | 'weekend' | 'disabled' | string,
}
