var express = require("express");
var router = express.Router();
var db = require("../models");

const axios = require('axios');
const bcrypt = require('bcrypt');
const { Sequelize } = require("../models");


// ---------------------------------USER AUTH ROUTES ---------------------------------
//route for delivering login handlebars, if the user is already
//need to investigate why we send user object, maybe for autofill?
router.get("/login", (req, res) => {
    res.render("login", { user: req.session.user })
})
//route for delivering signup handlebars
router.get("/signup", (req, res) => {
    res.render("signup", { user: req.session.user })
})
//this is the post version of login, so when we send it form data aka login creds do this
router.post('/login', (req, res) => {
    // finds one user based on where teh username in body matches that in the db
    db.User.findOne({
        where: { username: req.body.username }
    }).then(user => {
        //this is where the auth magic happens
        //if no user exists in db
        if (!user) {
            //destroy the req.session for security and send back error
            req.session.destroy();
            return res.status(401).send('incorrect username or password')
        }
        //else if the password in req.body matches the user hash password
        //the has password is created in the user model, and adds salt to plain test
        //bcrypt is the package doing the encryping and allowing us to decode
        else if (bcrypt.compareSync(req.body.password, user.password)) {
            //if the user credentials are good, set the session equal to such so that
            //the user can access all the data they are linked to
            req.session.user = {
                username: user.userame,
                id: user.id
            }
            //plop them on their drinks page
            return res.redirect("/drinks")
        }
        //else the password must have been wrong so reject agaain
        else {
            req.session.destroy();
            return res.status(401).send('incorrect username or password')
        }
    })
})
//route for handling the actual signup request
router.post('/signup', (req, res) => {
    //create a new user taking in the req.body
    db.User.create({
        username: req.body.username,
        password: req.body.password
    }).then(newUser => {
        //take that new user and set their session cookie to that info
        req.session.user = {
            username: newUser.username,
            id: newUser.id
        }
        //plop them on their drink page
        res.redirect("/drinks")
    }).catch(err => {
        console.log(err);
        res.status(500).send("server error")
    })
})

// If user logs out, nuke the req.session
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('logged out')
})


// ---------------------------------API Routes ---------------------------------
router.get("/api/cocktail", function (req, res) {
    db.Cocktail.findAll({
        include: [db.Ingredient]
    }).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(404).send(err)
    })
});
router.get("/api/cocktails/:id", function (req, res) {
    db.Cocktail.findAll({
        where: {
            id: req.params.id
        },
        include: [db.Ingredient]
    }).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(404).send(err)
    })
});
router.get("/api/user", function (req, res) {
    db.User.findAll({
        include: [db.Ingredient]
    }).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(404).send(err)
    })
});
router.get("/api/pantries/:userid", function (req, res) {
    db.User.findOne({
        where: {
            id: req.params.userid
        },
        include: [db.Ingredient]
    }).then(result => {
        res.json(result.Ingredients)
    }).catch(err => {
        res.status(404).send(err)
    })
});
router.get("/api/ingredient", function (req, res) {
    db.Ingredient.findAll({}).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(404).send(err)
    })
})
router.get("/api/ingredients/:id", function (req, res) {
    db.Ingredient.findAll({
        where: {
            id: req.params.id
        }
    }).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(404).send(err)
    })
})
// updated the route to drinks

router.get("/drinks", (req, res) => {
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
            // res.render("index", hbsObject)
            res.json(hbsObject)
        }).catch(err => {
            res.status(404).send(err)
        })
    })
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
