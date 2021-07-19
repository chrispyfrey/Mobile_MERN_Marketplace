# Group #11 Final Project

Backend server for our React Native mobile marketplace. Uses the MERN Marketplace Server code as the groundwork and heavily expands on it to support round-up of purchases to support charities.

If you are running the Native client, you do not need to run your own server for the client to work. A server has been hosted on Heroku at `https://csc3916-team11-final-server.herokuapp.com/`. The client should default to connecting to the Heroku instance.

### Install dependancies
    npm install
    
### Ensure .env secrets are configured for database
    config/config.js

### Run server
    node -r dotenv/config server.js
