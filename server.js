var express = require("express");
var db = require("./models")
var app = express();
var routes = require("./controllers/burgers_controller.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

//handlebars
const handlebars = require("express-handlebars");

app.engine(handlebars({
  defaultLayout: "index",
  layoutsDir: `$(_dirname)/views/layouts`,
  partialsDir: `$(_dirname)/views/partials`
}));
app.use(express.static('public'));
app.get("/", (req, res) => {
  res.render('main', {layout: 'index'});


var PORT = process.env.PORT || 3000;
db.sequelize.sync({force:true}).then(function() {
  app.listen(PORT, function() {
    console.log("App now listening on port:", PORT);
  });
})})
