require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const webRoutes = require("./Web/routes.js");
const apiRoutes = require("./Api/routes.js");

const app = express();
const port = 3000;

// enable JSON parsing
app.use(bodyParser.json());

app.use("/", apiRoutes);
app.use("/", webRoutes);


app.use("/.well-known", express.static(__dirname + "/.well-known"))

app.listen(port, () => console.log("Server started on port " + port + "!"));