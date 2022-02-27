import { Dayjs } from "dayjs";

export const getDayOffset = (date: Dayjs, tz: string) => {
  const noTime = date.set('h', 0).set('m', 0).set('s', 0).set('ms', 0).tz(tz)
  const atNight = noTime.set('hour', 1).tz(tz)
  const nextDay = noTime.add(1, 'day').tz(tz)

  return atNight.utcOffset() - nextDay.utcOffset();
}
