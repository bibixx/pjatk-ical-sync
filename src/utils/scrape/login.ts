import { CookieAccessInfo, CookieJar } from 'cookiejar';
import fetch, { Headers, RequestInit } from 'node-fetch';
import { PASSWORD, USERNAME } from '../env';
import { parseViewStateTokens } from './parseViewStateTokens';

export const login = async (cookieJar: CookieJar) => {
  const initialHeaders = new Headers();
  initialHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0");

  const initialResponse = await fetch("https://planzajec.pjwstk.edu.pl/Logowanie.aspx", { headers: initialHeaders });
  const html = await initialResponse.text();
  const tokens = parseViewStateTokens(html);

  const initialCookies = initialResponse.headers.raw()['set-cookie'];
  if (initialCookies) {
    initialCookies.forEach(cookie => cookieJar.setCookie(cookie));
  }

  const myHeaders = new Headers();
  myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Cookie", cookieJar.getCookies(CookieAccessInfo.All).toValueString());

  const urlencoded = new URLSearchParams();
  urlencoded.append("__VIEWSTATE", tokens.viewState);
  urlencoded.append("__EVENTVALIDATION", tokens.eventValidation);
  if (tokens.viewStateGenerator) {
    urlencoded.append("__VIEWSTATEGENERATOR", tokens.viewStateGenerator);
  }
  urlencoded.append("ctl00$ContentPlaceHolder1$Login1$UserName", USERNAME!);
  urlencoded.append("ctl00$ContentPlaceHolder1$Login1$Password", PASSWORD!);
  urlencoded.append("ctl00$ContentPlaceHolder1$Login1$LoginButton", "Zaloguj");

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'manual'
  };

  const firstResponse = await fetch("https://planzajec.pjwstk.edu.pl/Logowanie.aspx", requestOptions);
  
  const loginCookies = firstResponse.headers.raw()['set-cookie'];
  if (loginCookies) {
    loginCookies.forEach(cookie => cookieJar.setCookie(cookie));
  }

  const nextLocation = firstResponse.headers.get("location");
  if (!nextLocation) {
    throw new Error('Login failed! No redirect location received.');
  }

  const nextHeaders = new Headers();
  nextHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0");
  nextHeaders.append("Cookie", cookieJar.getCookies(CookieAccessInfo.All).toValueString());

  const secondResponse = await fetch(nextLocation, { headers: nextHeaders });
  
  const secondCookieHeader = secondResponse.headers.raw()['set-cookie'];
  if (secondCookieHeader) {
    secondCookieHeader.forEach(cookie => cookieJar.setCookie(cookie));
  }

  return secondResponse;
}
