import { VercelRequestQuery } from "@vercel/node";
import dayjs from "dayjs";

interface Args {
  from: dayjs.Dayjs
  to: dayjs.Dayjs
  debug: boolean
  authenticated: boolean
}

const deArrayify = <T>(arrayLike: T[] | T) => Array.isArray(arrayLike) ? arrayLike[0] : arrayLike

const defaultFrom = dayjs().subtract(1, 'year')
const defaultTo = dayjs().add(1, 'year')

const CALENDAR_PASSWORD = process.env.CALENDAR_PASSWORD

export const getArgs = (query: VercelRequestQuery): Args => {
  const from = deArrayify(query.from) as string | undefined;
  const to = deArrayify(query.to) as string | undefined
  const debug = deArrayify(query.debug) as string | undefined
  const password = deArrayify(query.password) as string | undefined

  const hasPassword = CALENDAR_PASSWORD !== undefined

  return {
    from: from ? dayjs(from) : defaultFrom,
    to: to ? dayjs() : defaultTo,
    debug: debug === 'true',
    authenticated: hasPassword
      ? password !== undefined && password === CALENDAR_PASSWORD
      : true
  }
}
