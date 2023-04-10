module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("order", {
    interviews: {
      type: DataTypes.STRING,
    },
    totalPrice: {
      type: DataTypes.STRING,
    },
    paymentMode: {
      type: DataTypes.STRING,
    },
    paymentProof: {
      type: DataTypes.STRING,
    },
  });
  return Order;
};