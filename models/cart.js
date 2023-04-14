module.exports = (sequelize, DataTypes) => {
    const cart = sequelize.define("cart", {
      userId: {
        type: DataTypes.STRING,
      },
      jobs: {
        type: DataTypes.JSON,
      },
     
    });
    return cart;
  };