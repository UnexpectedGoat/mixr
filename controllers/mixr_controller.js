
var express = require("express");

var router = express.Router();

var db = require("../models");

const apiTest = {
  "idDrink": "11007",
  "strDrink": "Margarita",
  "strTags": "IBA,ContemporaryClassic",
  "strCategory": "Ordinary Drink",
  "strIBA": "Contemporary Classics",
  "strAlcoholic": "Alcoholic",
  "strGlass": "Cocktail glass",
  "strInstructions": "Rub the rim of the glass with the lime slice to make the salt stick to it. Take care to moisten only the outer rim and sprinkle the salt on it. The salt should present to the lips of the imbiber and never mix into the cocktail. Shake the other ingredients with ice, then carefully pour into the glass.",
  "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
  "strIngredient1": "Tequila",
  "strIngredient2": "Triple sec",
  "strIngredient3": "Lime juice",
  "strIngredient4": "Salt",
  "strMeasure1": "1 1/2 oz ",
  "strMeasure2": "1/2 oz ",
  "strMeasure3": "1 oz ",
  }

// TODO: route for getting drinks in favorites
// TODO: route for deleting items from pantry
// TODO: route for creating your own cocktail to favorites
router.get("/", function(req, res) {
  // db.all(data => {
    // Using apiTest variable above for testing. Will swap out with handlebars variable below. as we build things out.
    // const hbsObject = {
    //   drinks: data
    // };
    // res.render("index", hbsObject)
  // });
  res.render("index", apiTest)
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
