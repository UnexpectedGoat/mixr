var express = require("express");
var db = require("./models")
var app = express();
var routes = require("./controllers/mixr_controller.js");
var path = require('path');


app.use(express.static("public"));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

//handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main",}));
app.set("view engine", "handlebars");

app.use(express.static('public'));

var PORT = process.env.PORT || 3000;
db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App now listening on port:", PORT);
  });
});
