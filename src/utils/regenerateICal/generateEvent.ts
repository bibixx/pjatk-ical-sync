import { ICalCalendar, ICalEventData } from "ical-generator"
import stringify from "json-stable-stringify";
import { createHash } from "crypto";

export const generateEvent = (calendar: ICalCalendar, eventData: Omit<ICalEventData, 'id'>) => {
  const stringifiedData = stringify(eventData);
  const id = createHash('md5').update(stringifiedData).digest('hex')

  return calendar.createEvent({
    id,
    ...eventData,
  });
}
