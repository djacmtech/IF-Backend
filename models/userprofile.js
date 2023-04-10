module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      Name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      SAPID: {
        type: DataTypes.STRING,
      },
      Contact: {
        type: DataTypes.STRING,
      },
      Gender: {
        type: DataTypes.STRING,
      },
      Acadyr: {
        type: DataTypes.STRING,
      },
      Department: {
        type: DataTypes.STRING,
      },
      Graduationyr: {
        type: DataTypes.STRING,
      },
      Resume: {
        type: DataTypes.STRING,
      },
      Acm_member: {
        type: DataTypes.STRING,
      },
    });
    return Banner;
  };