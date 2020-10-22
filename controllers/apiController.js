var express = require("express");
var router = express.Router();
var db = require("../models");

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
router.get("/api/mycocktails/:userid", function (req, res) {
    db.User.findOne({
        where:{
            id:req.params.userid
        },
        include: [db.Cocktail]
    }).then(result => {
    res.json(result)
    }).catch(err =>{
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
// Displays all cocktails that have ingredients matching the indicated ID
// router.get("/api/cocktaildb/:id", function (req, res) {
//     db.Ingredient.findAll({
//         where: {
//             id: req.params.id
//         },
//         include: [db.Cocktail]
//     }).then(cocktails => {
//         res.json(cocktails);
//     })
// });
module.exports = router;