module.exports = (sequelize, DataTypes) => {
    const Jdes = sequelize.define("Jdes", {
      Upi_id: {
        type: DataTypes.STRING,
      },
      pay_ss: {
        type: DataTypes.STRING,
      },

    });
    return payment;
  };