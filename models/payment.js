module.exports = (sequelize, DataTypes) => {
    const payment = sequelize.define("payment", {
      Upi_id: {
        type: DataTypes.STRING,
      },
      pay_ss: {
        type: DataTypes.STRING,
      },
      pay_info: {
        type: DataTypes.STRING,
      },
      count: {
        type: DataTypes.STRING,
      },

    });
    return payment;
  };