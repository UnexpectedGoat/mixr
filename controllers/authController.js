const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require('bcrypt');


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
    res.redirect("/login");
})

module.exports = router;