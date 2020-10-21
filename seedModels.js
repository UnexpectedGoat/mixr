const sequelize_fixtures = require('sequelize-fixtures');
const models = require('./models');

sequelize_fixtures.loadFile("./fixtures/cocktailSeeds.json", models).then(function(){
    console.log("success")
});

sequelize_fixtures.loadFile("./fixtures/ingredientSeeds.json", models).then(function(){
    console.log("success")
});