const app = require('./app')
const http = require('http')
const logger = require('morgan')


/**
 * Create HTTP server.
 */
const server = http.createServer(app)
logger.info('Server start at port %s', app.port)

