import dayjs from "dayjs";
import { CALENDAR_PASSWORD } from "./env";

interface Args {
  from: dayjs.Dayjs
  to: dayjs.Dayjs
  debug: boolean
  debugPrefix: boolean
  authenticated: boolean
  session: string | undefined
}

const deArrayify = <T>(arrayLike: T[] | T) => Array.isArray(arrayLike) ? arrayLike[0] : arrayLike

const defaultFrom = dayjs().subtract(1, 'year')
const defaultTo = dayjs().add(1, 'year')

export const getArgs = (query: Record<string, string | string[]>): Args => {
  const from = deArrayify(query.from) as string | undefined;
  const to = deArrayify(query.to) as string | undefined
  const debug = deArrayify(query.debug) as string | undefined
  const debugPrefix = deArrayify(query.debugPrefix) as string | undefined
  const password = deArrayify(query.password) as string | undefined
  const session = deArrayify(query.session) as string | undefined

  const hasPassword = CALENDAR_PASSWORD !== undefined

  return {
    from: from ? dayjs(from) : defaultFrom,
    to: to ? dayjs(to) : defaultTo,
    debug: debug === 'true',
    debugPrefix: debugPrefix === 'true',
    authenticated: hasPassword
      ? password !== undefined && password === CALENDAR_PASSWORD
      : true,
    session
  }
}
