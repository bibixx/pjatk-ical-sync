import Fastify, { FastifyLoggerOptions } from 'fastify'
import fs from 'node:fs'
import path from 'node:path'
import { pino } from 'pino';
import PinoPretty from 'pino-pretty';
import { CookieJar } from 'cookiejar';

import './utils/setup'
import { regenerateICal } from './utils/regenerateICal/regenerateICal';
import { getArgs } from './utils/getArgs';
import { login } from './utils/scrape/login';
import { getCal } from './utils/scrape/getCal';
import { PASSWORD, USERNAME } from './utils/env';

const logsPath = path.resolve('logs')
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath)
}

const fastify = Fastify({
  logger: {
    redact: ['req.query.password'],
    stream: pino.multistream([
      { stream: PinoPretty({}) },
      { stream: fs.createWriteStream(path.resolve(logsPath, 'all.log')) },
      { stream: fs.createWriteStream(path.resolve(logsPath, 'error.log')), level: 'error' }
    ]),
    serializers: {
      req: (request) => {
        return {
          method: request.method,
          path: request.routerPath,
          query: request.query,
          parameters: request.params,
          headers: request.headers
        };
      }
    }
  } as FastifyLoggerOptions
})

fastify.get('/', async (request, response) => {
  const { from, to, debug, authenticated } = getArgs(request.query as any)

   if (!authenticated) {
     return response
       .status(503)
       .send('Forbidden');
   }

  const cookieJar = new CookieJar()
  await login(cookieJar)
  const calResponse = await (await getCal(cookieJar, from, to)).text()

  const newICal = regenerateICal(calResponse, debug)

  if (!debug) {
    response.header('Content-Type', 'text/calendar')
  }

  response.send(newICal)
})


if (!USERNAME) {
  fastify.log.error('Username hasn\'t been setup yet.')
  process.exit(1)
}

if (!PASSWORD) {
  fastify.log.error('Password hasn\'t been setup yet.')
  process.exit(1)
}

fastify.listen({
  port: 3000,
}, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
