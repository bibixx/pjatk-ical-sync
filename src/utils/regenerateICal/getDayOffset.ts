import { Dayjs } from "dayjs";

export const getDayOffset = (date: Dayjs, tz: string) => {
  const noTime = date.set('h', 0).set('m', 0).set('s', 0).set('ms', 0).tz(tz)
  const atDay = noTime.set('hour', 12).tz(tz)
  const previousDay = noTime.subtract(1, 'day').tz(tz)

  return previousDay.utcOffset() - atDay.utcOffset();
}
