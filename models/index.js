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

db.Jdes = require('./Job.js')(sequelize, Sequelize);
db.User = require('./user.js')(sequelize, Sequelize);
db.payment = require('./order.js')(sequelize, Sequelize);

db.User.hasMany(db.payment);
db.payment.belongsTo(db.User);

db.payment.hasMany(db.Jdes);
db.Jdes.belongsTo(db.payment);

module.exports = db;
 
