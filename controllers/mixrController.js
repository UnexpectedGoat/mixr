var express = require("express");
var router = express.Router();
var db = require("../models");
const { Op } = require("sequelize");
const axios = require('axios');
const bcrypt = require('bcrypt');
const { Sequelize } = require("../models");
const cocktail = require("../models/cocktail");

const testUser = {
    username: "unexpectedGoat",
    id: 1
}

// Updated the route to drinks
router.get("/", (req, res) => {
    res.render("login")
})

router.get("/cocktails", (req, res) => {
    db.Cocktail.findAll({
        include: [db.Ingredient]
    }).then(result => {
        const cocktailJson = result.map(e => {
            return e.toJSON()
        })
        const hbsObject = {
            drinks: cocktailJson
        };
        res.render("alldrinks", hbsObject)
    }).catch(err => {
        res.status(404).send(err)
    })
});

// Displays Cocktails the user has added to their list or created
router.get("/mycocktails", (req, res) => {
    if(req.session.user){
        const userid = req.session.user.id
        db.Cocktail.findAll({
            include: [{model: db.Ingredient}, {model: db.User, where:{
                id:userid
            }}]
        }).then(result=>{
            const cocktailJson = result.map(e => {
                return e.toJSON()
            })
            const hbsObject = {
                drinks: cocktailJson
            };
            // Can change the name of index if it makes more sense later on
            // res.json(hbsObject)
            res.render("index", hbsObject)
        }).catch(err => {
            res.status(404).send(err)
        }) 
    }else{
        res.render("login")
    }
    
});

// Displays only the cocktails that the user is able to make based on what's in their pantry NOTE - Will also display cocktails that have no ingredients, which should be none if things are organized correctly in the database, but if you're seeing more show up than expected, check that:
router.get("/can_make", (req, res) => {
    if(req.session.user){
        db.User.findOne({
            where: { id: req.session.user.id },
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
                res.render("canMake", hbsObject)
            }).catch(err => {
                res.status(404).send(err)
            })
        })
    }else{
        res.render("login")
    }
});


router.get("/drinksearch", function (req, res) {
    const hbsObject = req.session.search
    res.render("drinksearch", hbsObject)
});
// Allows user to search cocktail database
router.post("/drinksearch", async (req, res) => {
    console.log("POST")
    try{
        //first search the db by cocktail name
        const nameSearch = await db.Cocktail.findAll({
            where: {
                name: {
                    [Op.like]: `%${req.body.name}%`
                  }
            },
            include:[db.Ingredient] 
        
        
        })
        //then
        const ingSearch = await db.Cocktail.findAll({
            include: [{
                model: db.Ingredient, 
                through:{
                    attributes: ['Ingredient.name'],
                    where: {[Op.like]: `%${req.body.name}%`}
                    
                  }
            }]
        })
        const drinks = () => {
            const nameJson = nameSearch.map(drink => {
                return drink.toJSON()
            })
            const ingJson = ingSearch.map(drink => {
                return drink.toJSON()
            })
            console.log(ingJson)
            return nameJson.concat(ingJson)
        }
        const drinkData = await drinks();
        console.log(drinks)
        const hbsObject = {
            drinks: drinkData
        };
        req.session.search = hbsObject
        res.status(200).send("Found a drink")
    }
    catch{
        res.status(404).send(err)
    }
});



//sends the dummy pantry data to the pantry view
router.get("/pantry", function (req, res) {
    if (req.session.user) {
        const userid = req.session.user.id
        db.User.findOne({
            where: {
                id: userid
            },
            include: [db.Ingredient]
        }).then(userResult => {
            // TODO: need to figure out how to pass a straight obejct into handlebars
            //find the ingredient
            db.Ingredient.findAll({}).then(ingResult => {
                //build the pantry from the user find
                const pantry = userResult.Ingredients.map(e => {
                    return e.toJSON()
                })
                var hbsObject = {
                    pantry: pantry
                };
                res.render("pantry", hbsObject)
            })
        }).catch(err => {
            res.status(404).send(err)
        })
    } else {
        res.render("login")
    }
});
// adding an item to pantry
router.post("/pantry", function (req, res) {
    if (req.session.user) {
        const userid = req.session.user.id
        req.body.ingredient
        db.Ingredient.findOne({
            where: {
                name: req.body.ingredient
            }
        }).then(result => {
            //if no ingredient is found, we need to create that ingredient then associate it
            if (result.length === 0) {
                // add to ingredient list
                db.Ingredient.create({
                    name: req.body.ingredient
                }).then(newIngredient => {
                    //associate that ingredient to the user in the pantry table
                    db.Pantry.create({
                        UserId: userid,
                        IngredientId: newIngredient.id
                    })
                    res.status(200).send("Ingredident added")
                }).catch
            }
            //if an ingredient is found, we need to create an association to it
            else {
                result = result.toJSON()
                db.Pantry.create({
                    UserId: userid,
                    IngredientId: result.id
                })
                res.status(200).send("Ingredident added")
            }
        })
    } else {
        res.render("login")
    }
})
// Add a cocktail to a users favorites
router.delete("/pantry", function (req, res) {
    if (req.session.user) {
        const userid = req.session.user.id
        // const userid = req.seesion.user.id
        console.log(req.body.id)
        db.Pantry.destroy({
            where: {
                userId: userid,
                ingredientId: req.body.id
            }
        }).then(userResult => {
            res.status(200).send(`${userid} no longer has ${req.body.id} in their pantry`)
        }).catch(err => {
            res.status(404).send(err)
        })
    } else {
        res.render("login")
    }
})

router.post("/addcocktail", function (req, res) {
    if (req.session.user) {
        const userid = req.session.user.id
        // const userid = req.seesion.user.id
        console.log("Route Hit")
        db.User.findOne({
            where: {
                id: userid
            }
        }).then(userResult => {
            userResult.addCocktail([req.body.id])
            res.status(200).send("Association added")
        }).catch(err => {
            res.status(404).send(err)
        })
    } else {
        res.render("login")
    }
});
router.get("/createcocktail", function (req, res) {
    if (req.session.user) {
        res.render("createcocktail")
    } else {
        res.render("login")
    }

});
router.post("/createcocktail", async (req, res) => {
    if (req.session.user) {
        try {
            //setup the test userId
            const userid = testUser.id
            //Create a new cocktail with the req.body
            const newCocktail = await db.Cocktail.create({
                name: req.body.name,
                instructions: req.body.instructions,
                img_url: req.body.img_url
            })
            //associate that new cockdtail with a user
            await newCocktail.addUser([userid])
            //we need to parse through the ingredients to see if its in our table or new
            req.body.ingredients.forEach(async e => {
                //search to see if the ingredient item e is in the database
                const ingredientSearch = await db.Ingredient.findOne({
                    where: {
                        name: e.ingredient
                    }
                })
                // if it's not in the database
                if (!ingredientSearch) {
                    // make a new ingredient
                    const newIngredient = await db.Ingredient.create({
                        name: e.ingredient
                    })
                    // associate that new ingredient to the newCocktail
                    db.CocktailIngredient.create({
                        amount: parseFloat(e.amount),
                        measurement: e.measure,
                        CocktailId: newCocktail.id,
                        IngredientId: newIngredient.id
                    })
                    res.status(200).send("Ingredient created for new cocktail")
                } else {
                    // otherwise if the ingredient is in the db, just associate that ingredient to newCocktail
                    db.CocktailIngredient.create({
                        amount: parseFloat(e.amount),
                        measurement: e.measure,
                        CocktailId: newCocktail.id,
                        IngredientId: ingredientSearch.id
                    })
                    res.status(200).send("Ingredient assocaited to new cocktail")
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    } else {
        res.render("login")
    }

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
        res.render("bartenderschoice", randomObject);
    })

    // The code below will pull a random cocktail from the Cocktail DB API:
    // const apiKey = 9973533;
    // axios.get(`https://www.thecocktaildb.com/api/json/v2/${apiKey}/random.php`).then(randomCocktail => {
    //     res.json(randomCocktail.data)
    // })
})

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