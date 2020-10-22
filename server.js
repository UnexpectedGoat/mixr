var express = require("express");
var db = require("./models")
var app = express();
var routes = require("./controllers/mixr_controller.js");
var path = require('path');
const seedModels = require("./seedModels.js")
const session = require('express-session')

require('dotenv').config()


app.use(express.static("public"));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// User session boilerplate, saves the user as logged in as a cookie
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 2 * 60 * 60 * 1000
  }
}))

//handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main",}));
app.set("view engine", "handlebars");


var PORT = process.env.PORT || 3000;
db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    seedModels()
    console.log("App now listening on port:", PORT);
  });
});
