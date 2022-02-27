import iCal from 'ical'
import iCalGenerator from 'ical-generator';
import { getDates } from './getDates';
import { getDescription } from './getDescription';
import { parseSummary } from './parseSummary';

export const regenerateICal = (icsFileContents: string, debug: boolean) => {
  const iCalData = iCal.parseICS(icsFileContents)

  const calendar = iCalGenerator({
    name: 'PJATK',
    url: 'http://192.168.92.206:8080/out.ics',
  });
  calendar.prodId({
    company: 'bibixx',
    product: 'PJATK',
    language: 'PL'
  });

  for (const key in iCalData) {
    if (Object.hasOwnProperty.call(iCalData, key)) {
      const entry = iCalData[key];

      if (entry.type !== 'VEVENT') {
        continue;
      }

      const { subject, className } = parseSummary(entry.summary)
      const { start, end, adjustedBy } = getDates(entry.start, entry.end)

      const summarySuffix = debug ? ` ${Math.random()}` : ''

      calendar.createEvent({
        start: start.format('YYYY-MM-DDTHH:mm:ssZ'),
        end: end.format('YYYY-MM-DDTHH:mm:ssZ'),
        summary: subject + summarySuffix,
        description: adjustedBy !== undefined
          ? getDescription(start, end, adjustedBy)
          : undefined,
        location: className,
        timezone: 'Europe/Warsaw'
      });
    }
  }

  return calendar.toString()
}
