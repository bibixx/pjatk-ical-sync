import { ICalCalendar, ICalEventData } from "ical-generator"
import stringify from "json-stable-stringify";
import md5 from "md5";

export const generateEvent = (calendar: ICalCalendar, eventData: Omit<ICalEventData, 'id'>) => {
  const stringifiedData = stringify(eventData);
  const id = md5(stringifiedData)

  return calendar.createEvent({
    id,
    ...eventData,
  });
}
