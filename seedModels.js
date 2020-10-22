const sequelize_fixtures = require('sequelize-fixtures');
const models = require('./models');
module.exports = function (){
    const seed = sequelize_fixtures.loadFile("./fixtures/cocktailSeeds.json", models).then(function(){
            console.log("success")
            sequelize_fixtures.loadFile("./fixtures/ingredientSeeds.json", models).then(function(){
                console.log("success")
                sequelize_fixtures.loadFile("./fixtures/CocktailIngredientSeeds.json", models).then(function(){
                    console.log("success")
                    sequelize_fixtures.loadFile("./fixtures/userSeeds.json", models).then(function(){
                        console.log("success")
                        sequelize_fixtures.loadFile("./fixtures/pantrySeeds.json", models).then(function(){
                            console.log("success")
                        });
                    });
                });
            });
        });
        
    return seed
}



