import { CookieJar } from 'cookiejar';
import './utils/setup'

import { fastify, runFastify } from './utils/fastify'
import { regenerateICal } from './utils/regenerateICal/regenerateICal';
import { getArgs } from './utils/getArgs';
import { login } from './utils/scrape/login';
import { getCal } from './utils/scrape/getCal';

fastify.get('/', async (request, response) => {
  const { from, to, debug, authenticated, session } = getArgs(request.query as any)

   if (!authenticated && session === undefined) {
     return response
       .status(403)
       .send('Forbidden');
   }

  const cookieJar = new CookieJar()

  if (session === undefined) {
    await login(cookieJar)
  } else {
    cookieJar.setCookie(`ASP.NET_SessionId=${session}`);
  }

  const calResponse = await getCal(cookieJar, from, to)
  const contentType = calResponse.headers.get('Content-Type');

  if (!contentType || !contentType?.startsWith('text/calendar')) {
    response.status(401)
    response.send('Given session is invalid.')
    return;
  }

  const calResponseContent = await calResponse.text()
  const newICal = regenerateICal(calResponseContent, debug)

  if (!debug) {
    response.header('Content-Type', 'text/calendar')
  }

  response.send(newICal)
})

runFastify()
