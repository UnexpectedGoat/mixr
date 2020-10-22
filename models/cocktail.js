module.exports = function (sequelize, DataTypes) {
    const Cocktail = sequelize.define("Cocktail", {
        name: DataTypes.STRING,
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        img_url: {
            type: DataTypes.STRING
        }
    });

    Cocktail.associate = models => {
        Cocktail.belongsToMany(models.Ingredient, {
            through: models.CocktailIngredient,
        });
        Cocktail.belongsToMany(models.User, {
            through: "UserCocktail"
          });
    };

    return Cocktail;
};