module.exports = function (sequelize, DataTypes) {
    const Pantry = sequelize.define("Pantry", {
        name: DataTypes.STRING,
        // allowNull: false
    });

    Pantry.associate = models => {
        Pantry.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    Pantry.associate = models => {
        Pantry.belongsToMany(models.Ingredient, {
            through: "IngredientList",
        });
    };

    return Pantry;
};