// https://github.com/pinojs/pino?tab=readme-ov-file
import pino from 'pino'
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})

export default logger
