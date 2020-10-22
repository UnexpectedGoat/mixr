const bcrypt = require("bcrypt")

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8]
      }
    }
  });

  User.associate = models => {
      User.belongsToMany(models.Ingredient,{
        through: models.Pantry,
      });
      User.belongsToMany(models.Cocktail, {
        through: "UserCocktail"
      });
  };
  
  User.beforeCreate(function(user){
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10),null);
})
  return User;
};
