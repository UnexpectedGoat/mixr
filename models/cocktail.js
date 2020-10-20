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
        Cocktail.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    Cocktail.associate = models => {
        Cocktail.belongsToMany(models.Ingredient, {
            through: "CocktailIngredient",
            // as: "Ingredient",
            // foreignKey: "Cocktail_id"
        });
    };

    return Cocktail;
};