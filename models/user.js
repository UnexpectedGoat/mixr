module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      username: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
        // TODO: validation on null
      },
      password: {
        type: DataTypes.STRING,
        // TODO: validation on null
      }
    });
    return User;
  };
  