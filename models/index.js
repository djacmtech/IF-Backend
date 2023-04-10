const dbConfig = require("../configs/db.config");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./userprofile.js')(sequelize, Sequelize);
db.Jdes = require('./Job.js')(sequelize, Sequelize);
db.payment = require('./payment.js')(sequelize, Sequelize);
module.exports = db;
 
