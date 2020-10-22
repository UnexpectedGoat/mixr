require("dotenv").config()
var express = require("express");
var db = require("./models")
var app = express();
var routes = require("./controllers/mixr_controller.js");
var path = require('path');
const seedModels = require("./seedModels.js")
const session = require('express-session')

var PORT = process.env.PORT || 3000;




app.use(express.static("public"));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// User session boilerplate, saves the user as logged in as a cookie
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 2 * 60 * 60 * 1000
  }
}))
app.use(routes);

//handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main",}));
app.set("view engine", "handlebars");



db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    seedModels()
    console.log("App now listening on port:", PORT);
  });
});
