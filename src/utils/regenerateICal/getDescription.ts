import { Dayjs } from "dayjs"

export const getDescription = (start: Dayjs, end: Dayjs, offset: number) => {
  const originalStartFormatted = start.subtract(offset, 'h').format('HH:mm')
  const originalEndFormatted = end.subtract(offset, 'h').format('HH:mm')

  return `Skorygowane o ${offset} godzinę (oryginalnie ${originalStartFormatted}-${originalEndFormatted})`
}
