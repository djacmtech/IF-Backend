module.exports = (sequelize, DataTypes) => {
    const Jdes = sequelize.define("Jdes", {
      Jpos: {
        type: DataTypes.STRING,
      },
      Cname: {
        type: DataTypes.STRING,
      },
      Stipend: {
        type: DataTypes.STRING,
      },
      Duration: {
        type: DataTypes.STRING,
      },
      Cdes: {
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
      Resume: {
        type: DataTypes.STRING,
      },
      Acm_member: {
        type: DataTypes.STRING,
      },
    });
    return Banner;
  };