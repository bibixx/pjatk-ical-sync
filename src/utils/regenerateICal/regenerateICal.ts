import iCal from 'ical'
import iCalGenerator from 'ical-generator';
import { getDates } from './getDates';
import { getDescription } from './getDescription';
import { parseSummary } from './parseSummary';
import { generateEvent } from './generateEvent'
import dayjs from 'dayjs';

export const regenerateICal = (icsFileContents: string, withDebugPrefix: boolean) => {
  const iCalData = iCal.parseICS(icsFileContents)

  const calendar = iCalGenerator({
    name: 'PJATK',
    url: 'https://ical.zdaj.se',
    timezone: 'Europe/Warsaw'
  });
  calendar.prodId({
    company: 'bibixx',
    product: 'PJATK',
    language: 'PL'
  });

  const now = dayjs()

  for (const key in iCalData) {
    if (Object.hasOwnProperty.call(iCalData, key)) {
      const entry = iCalData[key];

      if (entry.type !== 'VEVENT') {
        continue;
      }

      const { subject, className } = parseSummary(entry.summary)
      const { start, end, adjustedBy } = getDates(entry.start, entry.end)

      const debugPrefix = withDebugPrefix ? `[${now.format('HH:mm:ss')}] ` : ''

      generateEvent(calendar, {
        start: start.format('YYYY-MM-DDTHH:mm:ssZ'),
        end: end.format('YYYY-MM-DDTHH:mm:ssZ'),
        summary: `${debugPrefix}(${className}) ${subject}`,
        description: adjustedBy !== undefined
          ? getDescription(start, end, adjustedBy)
          : undefined,
        location: className,
      });
    }
  }

  return calendar.toString()
}
