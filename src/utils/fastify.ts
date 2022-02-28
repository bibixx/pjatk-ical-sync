import Fastify, { FastifyLoggerOptions } from 'fastify'
import fs from 'node:fs'
import path from 'node:path'
import { pino } from 'pino';
import PinoPretty from 'pino-pretty';
import { PASSWORD, USERNAME } from './env';

const logsPath = path.resolve('logs')
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath)
}

export const fastify = Fastify({
  logger: {
    redact: ['req.query.password', 'req.query.session'],
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

export const runFastify = () => {
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
}
