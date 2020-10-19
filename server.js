var express = require("express");
var db = require("./models")
var app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//handlebars
const handlebars = require("express-handlebars");

app.engine(handlebars({
  defaultLayout: "index",
  layoutsDir: `$(_dirname)/views/layouts`,
}));
app.set("view engine", "handlebars");

var routes = require("./controllers/burgers_controller.js");

app.use(routes);


var PORT = process.env.PORT || 3000;
db.sequelize.sync({force:true}).then(function() {
  app.listen(PORT, function() {
    console.log("App now listening on port:", PORT);
  });
});
