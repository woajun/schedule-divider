export interface Workdays {
  year:number,
  month:number,
  weekday: number[],
  holiday: number[],
}

export interface Shift {
  id: number,
  name: string,
  num: number,
}

export interface Worker {
  id: number,
  name: string,
  avoidDays: number[],
  weekday: number[],
  weekend: number[],
}

export interface CalendarIO {
  workers: Worker[]
  workdays: Workdays
}
