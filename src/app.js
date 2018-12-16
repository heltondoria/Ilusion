const express = require('express')
const statusMonitor = require('express-status-monitor')()
const bodyParser = require('body-parser')
const expressWinston = require('express-winston')
const winston = require('winston') // for transports.Console

const app = (module.exports = express())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// Let's make our express `Router` first.
const router = express.Router()

router.get('/error', function(req, res, next) {
  // here we cause an error in the pipeline so we see express-winston in action.
  return next(
    new Error('This is an error and it should be logged to the console')
  )
})

router.get('/', function(req, res, next) {
  res.write('This is a normal request, it should be logged to the console too')
  res.end()
})

// express-winston logger makes sense BEFORE the router
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  })
)

// Now we can tell the app to use our routing code:
app.use(router)

// express-winston errorLogger makes sense AFTER the router.
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  })
)


app.use(statusMonitor)

app.listen(3000, function() {
  console.log(
    'express-winston demo listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  )
})
