import fetch, { Headers } from 'node-fetch'
import { Dayjs } from 'dayjs'
import { CookieAccessInfo, CookieJar } from 'cookiejar'
import { parseViewStateTokens } from './parseViewStateTokens'

const formatDateSimple = (date: Dayjs) => date.format('DD.MM.YYYY')

const formatClientState = (date: Dayjs) => {
  return {
    "enabled": true,
    "emptyMessage": "",
    "validationText": date.format('YYYY-MM-DD-HH-mm-ss'),
    "valueAsString": date.format('YYYY-MM-DD-HH-mm-ss'),
    "minDateStr": "1980-01-01-00-00-00",
    "maxDateStr": "2099-12-31-00-00-00",
    "lastSetTextBoxValue": formatDateSimple(date)
  }
}

export const getCal = async (cookieJar: CookieJar, from: Dayjs, to: Dayjs) => {
  const getHeaders = new Headers();
  getHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0");
  getHeaders.append("Cookie", cookieJar.getCookies(CookieAccessInfo.All).toValueString());

  const getResponse = await fetch("https://planzajec.pjwstk.edu.pl/TwojPlan.aspx", { headers: getHeaders });
  const html = await getResponse.text();
  const tokens = parseViewStateTokens(html);

  const postHeaders = new Headers();
  postHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0");
  postHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  postHeaders.append("Cookie", cookieJar.getCookies(CookieAccessInfo.All).toValueString());

  const urlencoded = new URLSearchParams();
  urlencoded.append("__VIEWSTATE", tokens.viewState);
  urlencoded.append("__EVENTVALIDATION", tokens.eventValidation);
  if (tokens.viewStateGenerator) {
    urlencoded.append("__VIEWSTATEGENERATOR", tokens.viewStateGenerator);
  }
  
  urlencoded.append("ctl00$ContentPlaceHolder1$DedykowanyPlanStudenta$DateRangeFromRadDatePicker$dateInput", formatDateSimple(from));
  urlencoded.append("ctl00_ContentPlaceHolder1_DedykowanyPlanStudenta_DateRangeFromRadDatePicker_dateInput_ClientState", JSON.stringify(formatClientState(from)));
  urlencoded.append("ctl00$ContentPlaceHolder1$DedykowanyPlanStudenta$DateRangeToRadDatePicker$dateInput", formatDateSimple(to));
  urlencoded.append("ctl00_ContentPlaceHolder1_DedykowanyPlanStudenta_DateRangeToRadDatePicker_dateInput_ClientState", JSON.stringify(formatClientState(to)));
  urlencoded.append("ctl00$ContentPlaceHolder1$DedykowanyPlanStudenta$CalendarICalExportButton", "Eksportuj do iCalendar");

  return fetch("https://planzajec.pjwstk.edu.pl/TwojPlan.aspx", {
    method: 'POST',
    headers: postHeaders,
    body: urlencoded,
    redirect: 'follow'
  });
}
