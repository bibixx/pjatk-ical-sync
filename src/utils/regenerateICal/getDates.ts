import dayjs from "dayjs"
import { getDayOffset } from "./getDayOffset"

export const getDates = (start: Date | undefined, end: Date | undefined) => {
  const startDate = dayjs.utc(start).tz('Europe/Warsaw')
  const endDate = dayjs.utc(end).tz('Europe/Warsaw')

  const dstTransitionOffset = getDayOffset(startDate, 'Europe/Warsaw')

  return {
    start: startDate.add(dstTransitionOffset, 'minutes').subtract(1, 'hour'),
    end: endDate.add(dstTransitionOffset, 'minutes').subtract(1, 'hour'),
    adjustedBy: dstTransitionOffset !== 0
      ? dstTransitionOffset / 60
      : undefined
  }
}
