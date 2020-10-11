const express = require('express');
const http = require('http');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');

const initRoutes = require('./app.routes');
const { PORT } = require('./config');

(async function () {
  try {
    // Init Express App
    const app = express();
  
    // Middlewares
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json({limit: '50mb'}));
  
    // Init Routes
    initRoutes(app);

    // Create http server
    const server = http.createServer(app);

     
    // Start server on given Port
    server.listen(PORT, async () => {
      console.log(`Server started on port: ${PORT}`);
      try {
        console.log("Connection Success !");
      } catch (error) {
        console.log("Error in connection ", error);
      }
    })
  }catch(e) {
    console.log('Failed to start server: ', e);
  }
})();
