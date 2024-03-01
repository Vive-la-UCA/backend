const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { dbConnection } = require("../database/config");
require("dotenv").config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      location: "/api/location",
      route: "/api/route",
      test: "/api/test",
      user: "/api/users",
    };

    this.connectingDB();
    this.middlewares();
    this.routes();
  }

  async connectingDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.location, require("../routes/location"));
    this.app.use(this.paths.route, require("../routes/route"));
    this.app.use(this.paths.test, require("../routes/test"));
    this.app.use(this.paths.user, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

module.exports = Server;
