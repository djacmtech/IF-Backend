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

db.job = require('./job.js')(sequelize, Sequelize);
db.user = require('./user.js')(sequelize, Sequelize);
db.order = require('./order.js')(sequelize, Sequelize);
db.cart = require('./cart.js')(sequelize, Sequelize);

db.user.hasMany(db.order);
db.order.belongsTo(db.user);

db.order.hasMany(db.job);
db.job.belongsTo(db.order);

//cart can have many jobs and is associated with a user
db.cart.belongsTo(db.user);
db.user.hasMany(db.cart);

db.cart.hasMany(db.job);
db.job.belongsTo(db.cart);

module.exports = db;
 
