const parseIntEnv = <T extends number | undefined>(variable: string | undefined, defaultValue: T): number | T => {
  if (variable === undefined) {
    return defaultValue
  }

  const parsedValue = Number.parseInt(variable)

  if (Number.isNaN(parsedValue)) {
    return defaultValue
  }

  return parsedValue
}

export const CALENDAR_PASSWORD = process.env.CALENDAR_PASSWORD
export const USERNAME = process.env.USERNAME
export const PASSWORD = process.env.PASSWORD
export const PORT = parseIntEnv(process.env.PORT, 3000)
