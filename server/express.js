var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var compress = require('compression')
var cors = require('cors')
var helmet = require('helmet')
var userRoutes = require('./routes/user.routes')
var authRoutes = require('./routes/auth.routes')
var shopRoutes = require('./routes/shop.routes')
var productRoutes = require('./routes/product.routes')
var orderRoutes = require('./routes/order.routes')
var donationRoutes = require('./routes/donation.routes')

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', shopRoutes)
app.use('/', productRoutes)
app.use('/', orderRoutes)
app.use('/', donationRoutes)

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }
})

module.exports = app;
