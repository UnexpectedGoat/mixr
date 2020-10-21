module.exports = function (sequelize, DataTypes) {
    const Ingredient = sequelize.define("Ingredient", {
        name: DataTypes.STRING,
        // allowNull: false
    });

    Ingredient.associate = models => {
        Ingredient.belongsToMany(models.Pantry, {
            through: "IngredientList"
        });
    };

    Ingredient.associate = models => {
        Ingredient.belongsToMany(models.Cocktail, {
            through: models.CocktailIngredient,
        });
    };

    return Ingredient;
};