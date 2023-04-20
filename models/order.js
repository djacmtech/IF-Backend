module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("order", {
    totalPrice: {
      type: DataTypes.STRING,
    },
    paymentMode: {
      type: DataTypes.STRING,
    },
    paymentProof: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    discount: {
      type: DataTypes.STRING,
    },
    creditsUsed: {
      type: DataTypes.STRING,
    },
  });
  return Order;
};