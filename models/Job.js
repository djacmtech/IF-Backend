module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define("Job", {
      role: {
        type: DataTypes.STRING,
      },
      company: {
        type: DataTypes.STRING,
      },
      stipend: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      link: {
        type: DataTypes.JSON,
      },
      skills: {
        type: DataTypes.STRING,
      },
      perks: {
        type: DataTypes.STRING,
      },
      resume: {
        type: DataTypes.STRING,
      },
      acmMember: {
        type: DataTypes.STRING,
      },
    });
    return Job;
  };