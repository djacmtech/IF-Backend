const dbConfig = require("../configs/db.config");
const { Sequelize, DataTypes, BelongsToMany } = require("sequelize");

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

//one user can have one cart and that cart can have many jobs but one job can be in diff user's cart
db.user.hasOne(db.cart);
db.cart.belongsTo(db.user);

db.cart.belongsToMany(db.job, { 
  through: 'cartjob',
  foreignKey: 'cartId',
  otherKey: 'jobId' 
}); // A cart can have many jobs
db.job.belongsToMany(db.cart, { 
  through: 'cartjob',
  foreignKey: 'jobId',
  otherKey: 'cartId' 
}); // A job can belong to many carts

db.order.belongsTo(db.user);
db.user.hasMany(db.order);

db.order.belongsToMany(db.job, {
  through: 'orderjob',
  foreignKey: 'orderId',
  otherKey: 'jobId'
});
db.job.belongsToMany(db.order, {
  through: 'orderjob',
  foreignKey: 'jobId',
  otherKey: 'orderId'
});

module.exports = db;
 
