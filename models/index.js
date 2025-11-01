const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Category = require('../models/categorymodel')(sequelize);
const Service = require('../models/servicemodel')(sequelize);
const ServicePriceOption = require('../models/priceOptionmodel')(sequelize);

Category.hasMany(Service, { foreignKey: 'categoryId', as: 'services', onDelete: 'CASCADE' });
Service.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Service.hasMany(ServicePriceOption, { foreignKey: 'serviceId', as: 'priceOptions', onDelete: 'CASCADE' });
ServicePriceOption.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

module.exports = {
  sequelize,
  Category,
  Service,
  ServicePriceOption
};
