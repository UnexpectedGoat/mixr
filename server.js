var express = require("express");
var db = require("./models")
var app = express();
var routes = require("./controllers/mixr_controller.js");
var path = require('path');
const seedModels = require("./seedModels.js")


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
db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    seedModels()
    console.log("App now listening on port:", PORT);
  });
});
