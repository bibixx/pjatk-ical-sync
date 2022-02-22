import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CookieJar } from 'cookiejar';
import { getArgs } from '../utils/getArgs';
import { getCal } from '../utils/getCal';
import { login } from '../utils/login';

export default async function (req: VercelRequest, res: VercelResponse) {
  if (!process.env.USERNAME) {
    return res
      .status(500)
      .send('Username hasn\'t been setup yet.');
  }
  if (!process.env.PASSWORD) {
    return res
      .status(500)
      .send('Password hasn\'t been setup yet.');
  }

  const { from, to, debug, authenticated } = getArgs(req.query)

  if (!authenticated) {
    return res
      .status(503)
      .send('Forbidden');
  }

  const cookieJar = new CookieJar()

  await login(cookieJar)

  const calResponse = await getCal(cookieJar, from, to)
  const text = await calResponse.text();

  if (!debug) {
    res.setHeader('Content-Type', 'text/calendar')
  }

  res.send(text);
}
