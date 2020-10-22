var express = require("express");
var router = express.Router();
var db = require("../models");

const axios = require('axios');
const bcrypt = require('bcrypt');
const { Sequelize } = require("../models");

const testUser = {
    username: "unexpectedGoat",
    id: 1
}

// updated the route to drinks

router.get("/cocktails", (req, res) => {
    // TODO: will update to either the drink api call, or the findall from our own db
    db.Cocktail.findAll({
        include: [db.Ingredient]
    }).then(result => {
        const cocktailJson = result.map(e => {
            return e.toJSON()
        })
        const hbsObject = {
            drinks: cocktailJson
        };
        // Can change the name of index if it makes more sense later on
        res.json(hbsObject)
        // res.render("index", hbsObject)
    }).catch(err => {
        res.status(404).send(err)
    })
});
router.get("/mycocktails", (req, res) => {
    const userid = testUser.id
    // const userid = req.seesion.user.id
    db.User.findOne({
        where: {
            id: userid
        },
        include: [db.Cocktail]
    }).then(result => {
        console.log(result)
        const cocktailJson = result.Cocktails.map(e => {
            return e.toJSON()
        })
        const hbsObject = {
            drinks: cocktailJson
        };
        console.log(hbsObject)
        res.render("index", hbsObject)
    }).catch(err => {
        res.status(404).send(err)
    })
});

// Displays only the cocktails that the user is able to make based on what's in their pantry NOTE - Will also display cocktails that have no ingredients, which should be none if things are organized correctly in the database, but if you're seeing more show up than expected, check that:
router.get("/my_cocktails", (req, res) => {
    db.User.findOne({
        // TODO: swap in req.session.user.id when ready for deployment
        where: { id: 1 },
        include: {
            model: db.Ingredient
        }
    }).then(user => {
        db.Cocktail.findAll({
            include: [{
                model: db.Ingredient
            }]
        }).then(async result => {
            const userJson = user.toJSON()

            let drinksICanMake = [];
            for (let i = 0; i < result.length; i++) {
                let canMake = await user.hasIngredients(result[i].Ingredients);
                if (canMake) {
                    drinksICanMake.push(result[i]);
                }
            }
            const drinksJson = drinksICanMake.map(drink => {
                return drink.toJSON()
            })
            const hbsObject = {
                drinks: drinksJson,
                user: userJson
            };
            // Can change the name of index if it makes more sense later on
            res.render("index", hbsObject)
        }).catch(err => {
            res.status(404).send(err)
        })
    })
});

//sends the dummy pantry data to the pantry view
router.get("/pantry", function (req, res) {
    const userid = testUser.id
    // const userid = req.seesion.user.id
    db.User.findOne({
        where: {
            id: userid
        },
        include: [db.Ingredient]
    }).then(result => {
        const ingredientJson = result.Ingredients.map(e => {
            return e.toJSON()
        })
        var hbsObject = {
            pantry: ingredientJson
        };
        console.log(hbsObject)
        res.render("pantry", hbsObject)
    }).catch(err => {
        res.status(404).send(err)
    })


});
// Add a cocktail to a users favorites
router.delete("/pantry", function (req, res){
    console.log("Removing assoc")
    const userid = testUser.id
    // const userid = req.seesion.user.id
    console.log(req.body.id)
    db.Pantry.destroy({
        where:{
            userId: userid,
            ingredientId: req.body.id
        }
    }).then(userResult=>{
        res.status(200).send(`${userid} no longer has ${req.body.id} in their pantry`)
    }).catch(err =>{
        res.status(404).send(err)
    })

   
})
router.post("/addcocktail", function (req, res) {
    const userid = testUser.id
    // const userid = req.seesion.user.id
    console.log("Route Hit")
    db.User.findOne({
        where: {
            id: userid
        }
    }).then(userResult => {
        console.log(userResult)
        userResult.addCocktail([req.body.id])
        res.status(200).send("Association added")
    }).catch(err => {
        res.status(404).send(err)
    })
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

router.get("/bartenderschoice", (req, res) => {
    db.Cocktail.findAll({
        include: [db.Ingredient]
    }).then(allCocktails => {
        let cocktailsArray = [];
        for (let i = 0; i < allCocktails.length; i++) {
            cocktailsArray.push(allCocktails[i])
        }
        let random = Math.floor(Math.random() * cocktailsArray.length);
        let randomCocktail = cocktailsArray[random];
        randomCocktail = randomCocktail.toJSON();
        console.log(randomCocktail);
        const randomObject = {
            drinks: [randomCocktail]
        };
        // res.json(randomObject);
        console.log(randomObject)
        res.render("index", randomObject);
    })


    // The code below will pull a random cocktail from the Cocktail DB API:
    // const apiKey = 9973533;
    // axios.get(`https://www.thecocktaildb.com/api/json/v2/${apiKey}/random.php`).then(randomCocktail => {
    //     res.json(randomCocktail.data)
    // })
})

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
