module.exports = function (sequelize, DataTypes) {
    const CocktailIngredient = sequelize.define("CocktailIngredient", {
        amount: DataTypes.DECIMAL(10,2),
        // allowNull: false
    });
    return CocktailIngredient;
};