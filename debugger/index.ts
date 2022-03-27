import fetch from 'node-fetch'
import iCal from 'ical'
import dayjs, { Dayjs } from 'dayjs'
import colorize from 'json-colorizer';
import '../src/utils/setup'
import { getDates } from '../src/utils/regenerateICal/getDates'

const run = async () => {
  // /*
  const from = '2022-03-25'
  const to = '2022-03-29'
  const iCalContents = await fetch(`http://localhost:3000/?from=${from}&to=${to}`).then(res => res.text());
  const iCalData = iCal.parseICS(iCalContents)
  /*/
  const iCalData = {
    a: {
      start: new Date("2022-03-26T08:00:00.000Z"),
      end: new Date("2022-03-26T09:30:00.000Z"),
      type: 'VEVENT',
    },
    b: {
      start: new Date("2022-03-27T07:00:00.000Z"),
      end: new Date("2022-03-27T08:30:00.000Z"),
      type: 'VEVENT',
    }
  }
  //*/

  const days: Dayjs[] = []
  for (const key in iCalData) {
    if (Object.hasOwnProperty.call(iCalData, key)) {
      const entry = iCalData[key];

      if (entry.type !== 'VEVENT') {
        continue;
      }

      const { start, end } = entry;
      const wasLogged = days.some(d => d.isSame(start, 'day'))

      if (wasLogged) {
        continue;
      }

      days.push(dayjs(start))

      console.log(colorize(
        {
          start,
          end,
        } as any,
        { pretty: true }
      ))
    }
  }
}

run()
