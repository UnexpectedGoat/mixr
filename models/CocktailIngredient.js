module.exports = function (sequelize, DataTypes) {
    const CocktailIngredient = sequelize.define("CocktailIngredient", {
        amount: DataTypes.DECIMAL(10.2),
        measurement: DataTypes.STRING
        // allowNull: false
    });
    return CocktailIngredient;
};