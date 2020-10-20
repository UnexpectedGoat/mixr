module.exports = function (sequelize, DataTypes) {
    const Ingredient = sequelize.define("Ingredient", {
        name: DataTypes.STRING,
        // allowNull: false
    });

    // Ingredient.associate = models => {
    //     Ingredient.belongsToMany(models.Pantry, {
    //         through: "IngredientList",
    //         as: "Ingredient",
    //         foreignKey: "List_id"
    //     });
    // };

    Ingredient.associate = models => {
        Ingredient.belongsToMany(models.Cocktail, {
            through: "CocktailIngredient",
            // as: "Cocktail",
            // foreignKey: "Ingredient_id"
        });
    };
    // One pantry has many ingredients, AND one ingredient can show up in many pantries, so is this association configured correctly?

    return Ingredient;
};