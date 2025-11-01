const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServicePriceOption = sequelize.define('ServicePriceOption', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING, // e.g., "1 hour" or "1 month" or numeric + unit. Choose string for flexibility
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Hourly', 'Weekly', 'Monthly'),
      allowNull: false
    }
  }, {
    tableName: 'service_price_options',
    timestamps: true
  });

  return ServicePriceOption;
};
