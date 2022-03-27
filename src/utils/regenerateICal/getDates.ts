import dayjs from "dayjs"
import { getDayOffset } from "./getDayOffset"

export const getDates = (start: Date | undefined, end: Date | undefined) => {
  const startDate = dayjs.utc(start)
  const endDate = dayjs.utc(end)
  const dstTransitionOffset = getDayOffset(startDate, 'Europe/Warsaw')

  const newStartDate = startDate.add(dstTransitionOffset, 'minute');
  const newEndDate = endDate.add(dstTransitionOffset, 'minute');

  return {
    start: newStartDate,
    end: newEndDate,
    adjustedBy: dstTransitionOffset
      ? dstTransitionOffset / 60
      : undefined
  }
}
