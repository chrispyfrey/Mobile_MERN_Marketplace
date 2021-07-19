var app = require('./express');
var mongoose = require('mongoose');
var config = require('./config/config');

// Connection URL
mongoose.connect(config.mongoUri, { autoIndex: false, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
});

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
});
