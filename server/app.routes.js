const express = require("express");

const { API_PREFIX, IN_PROD } = require("./config");
const hexaland = require("./routes/hexaland.routes");


const getRoute = route => {
  return `${API_PREFIX}/${route}`;
};

const initRoutes = app => {
  const router = express.Router();

  router.get("/", (req, res) =>
    res.status(200).json({ success: true, message: "Server alive!" })
  );


  app.use(`${API_PREFIX}`, router);
  app.use(getRoute("hexaland"), hexaland);

  /** ------------------- Error Handlers ------------ */
  // Not Found Route
  app.use("*", (req, res, next) => {
    res.status(404).json({
      success: false,
      message: "Route Not Found"
    });
  });

  app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || "Internal server error";
    let e = err.err || {};

    // Send error message only in development mode.
    res.status(status).json({
      success: false,
      message,
      err: IN_PROD ? {} : e
    });
  });
};

module.exports = initRoutes;
