var express = require("express");

var router = express.Router();

var db = require("../models");

const axios = require('axios');
const bcrypt = require('bcrypt')

const drinkTest = [{
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
}, {
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
}, {
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
}]

const pantryTest = [{
    ingredient: "Vodka",
},
{
    ingredient: "Gin",
},
{
    ingredient: "Club Soda",
},
{
    ingredient: "Lemon",
},
{
    ingredient: "Lime",
},
{
    ingredient: "Bitters",
},
{
    ingredient: "Olives",
},
];

// TODO: route for getting drinks in favorites
// TODO: route for deleting items from pantry
// TODO: route for creating your own cocktail to favorites
// ---------------------------------USER AUTH ROUTES ---------------------------------
router.get("/login", (req, res) => {
    res.render("login", { user: req.session.user })
})
router.get("/signup", (req, res) => {
    res.render("signup", { user: req.session.user })
})
router.post('/login', (req, res) => {
    db.User.findOne({
        where: { username: req.body.username }
    }).then(user => {
        //check if user entered password matches db password
        if (!user) {
            req.session.destroy();
            return res.status(401).send('incorrect username or password')

        } else if (bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = {
                username: user.userame,
                id: user.id
            }
            return res.redirect("/drinks")
        }
        else {
            req.session.destroy();
            return res.status(401).send('incorrect username or password')
        }
    })
})
// ---------------------------------API Routes ---------------------------------
// updated the route to drinks
router.get("/drinks", function (req, res) {
    // TODO: will update to either the drink api call, or the findall from our own db
    var hbsObject = {
        drinks: drinkTest
    };
    // db.all(data => {
    // Using apiTest variable above for testing. Will swap out with handlebars variable below. as we build things out.
    // const hbsObject = {
    //   drinks: data
    // };
    // res.render("index", hbsObject)
    // });
    res.render("index", hbsObject)
});

//sends the dummy pantry data to the pantry view
router.get("/pantry", function (req, res) {
    var hbsObject = {
        pantry: pantryTest
    };
    res.render("pantry", hbsObject)
});

// Displays all cocktails that have ingredients matching the indicated ID
router.get("/api/cocktaildb/:id", function (req, res) {
    db.Ingredient.findAll({
        where: {
            id: req.params.id
        },
        include: [db.Cocktail]
    }).then(cocktails => {
        res.json(cocktails);
    })
});

// TODO: get cocktails from cocktailDB with axios call
router.get("/create", function (req, res) {
    res.render("upload", { key: "value" })
});

// Route for adding drink ingredient  
router.get("/join/:cocktailId/:ingredientId", function (req, res) {
    db.Cocktail.findOne({
        where: {
            id: req.params.cocktailId
        }
    }).then(result => {
        console.log(result)
        db.Ingredient.findOne({
            where: {
                id: req.params.ingredientId
            }
        }).then(ingredientResult => {
            console.log(ingredientResult)
            result.addIngredient(ingredientResult, { through: { amount: .75 } })
            res.json(ingredientResult)
        })

    })

});

// Route to update cocktail on User's "My Cocktails" page
// TODO: Associate this route with particular user ID
router.put("/cocktails/update/:id", function (req, res) {
    db.Cocktail.update({
        name: req.body.name,
        instructions: req.body.instructions,
        img_url: req.body.img_url
    },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(updatedCocktail => {
        if (updatedCocktail.changedRows == 0) {
            return res.status(404).end()
        } else {
            res.status(200).end();
        }
    });
});

// Route to delete selected cocktail when user chooses to do so:
router.delete("/cocktails/delete/:id", (req, res) => {
    db.Cocktail.destroy({
        where: {
            id: req.params.id
        }
    }).then(deletedCocktail => {
        if (deletedCocktail.affectedRows == 0) {
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    })
});

module.exports = router;
