module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    sap: {
      type: DataTypes.STRING,
    },
    contact: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    academicYear: {
      type: DataTypes.STRING,
    },
    department: {
      type: DataTypes.STRING,
    },
    graduationYear: {
      type: DataTypes.STRING,
    },
    resume: {
      type: DataTypes.STRING,
    },
    acmMember: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    }
  });
  return User;
};