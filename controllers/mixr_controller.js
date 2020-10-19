
var express = require("express");

var router = express.Router();

var db = require("../models");

// TODO: route for getting drinks in favorites
// TODO: route for deleting items from pantry
// TODO: route for creating your own cocktail to favorites
router.get("/", function(req, res) {
});
  // TODO: get cocktails from cocktailDB with axios call
router.post("/cocktails/create", function(req, res) {
  // TODO:saving a cocktail from axios return to favorites
});


router.put("/cocktails/update/:id", function(req, res) {
  //TODO: update a cocktail in favorites
});

router.delete("/cocktails/delete/:id", function(req, res) {
  // TODO: remove cocktail from favorites
});

module.exports = router;
