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
    User.hasMany(models.Cocktail)
  };

  User.associate = models => {
    User.belongsToMany(models.Ingredient,{
      through: models.Pantry,
  });
  };

  return User;
};
