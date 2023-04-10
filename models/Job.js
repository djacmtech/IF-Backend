module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define("Job", {
      role: {
        type: DataTypes.STRING,
      },
      company: {
        type: DataTypes.STRING,
      },
      logo: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      mode: {
        type: DataTypes.STRING,
      },
      stipend: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.STRING,
      },
      about: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      link: {
        type: DataTypes.JSON,
      },
      requirements: {
        type: DataTypes.JSON,
      },
      skills: {
        type: DataTypes.JSON,
      },
      perks: {
        type: DataTypes.JSON,
      },
    });
    return Job;
  };