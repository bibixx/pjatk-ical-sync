import { CookieAccessInfo, CookieJar } from 'cookiejar';
import fetch, { Headers } from 'node-fetch'

export const login = async (cookieJar: CookieJar) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("__VIEWSTATE", "/wEPDwULLTIwNTc0NzU1NjcPZBYCZg9kFgICAw9kFgICAw9kFgICAQ88KwAKAQAPFgIeCFVzZXJOYW1lBQ09PT09PT09PT09PT09ZGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgEFMWN0bDAwJENvbnRlbnRQbGFjZUhvbGRlcjEkTG9naW4xJExvZ2luSW1hZ2VCdXR0b25g+d7dlbzrQBKLVEVYUgOQI/gAkFkzxhrlzvmkpdm9Tw==");
  urlencoded.append("__EVENTVALIDATION", "/wEdAAR6XI2NHp8SzQgFYIeLLXKt1YzBi/v72U3i/iPEshIfWPYuJ84xN8rnDqaBemzuTFmOyFcXWscB3PftW1vB/HG2IDUELLwODPeZsDUck1hJKFkl46rPW7nppdd1c8aT/r4=");
  urlencoded.append("ctl00$ContentPlaceHolder1$Login1$UserName", process.env.USERNAME!);
  urlencoded.append("ctl00$ContentPlaceHolder1$Login1$Password", process.env.PASSWORD!);
  urlencoded.append("ctl00$ContentPlaceHolder1$Login1$LoginButton", "Zaloguj");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'manual' as const
  };

  const firstResponse = await fetch("https://planzajec.pjwstk.edu.pl/Logowanie.aspx", requestOptions)
  const [firstCookie] = firstResponse.headers.raw()['set-cookie'][0].split(';')
  const nextLocation = firstResponse.headers.get("location")!

  cookieJar.setCookie(firstCookie);

  const nextHeaders = new Headers();
  nextHeaders.append(
    "Cookie",
    cookieJar.getCookies(CookieAccessInfo.All).toValueString()
  );
  const nextOptions = {
    headers: nextHeaders,
  }

  const secondResponse = await fetch(nextLocation, nextOptions)
  const [secondCookie] = secondResponse.headers.raw()['set-cookie'][0].split(';')

  cookieJar.setCookie(secondCookie);

  return secondResponse
}
