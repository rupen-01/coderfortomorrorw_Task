const {
  Service,
  ServicePriceOption,
  Category,
  sequelize,
} = require("../models/index");
const { Op } = require("sequelize");

// =============== add =================
exports.addService = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { categoryId } = req.params;
    const { name, type, description, priceOptions } = req.body;
    // check category exists
    const cat = await Category.findByPk(categoryId);
    if (!cat) {
      await t.rollback();
      return res.status(404).json({ message: "Category not found" });
    }
    const service = await Service.create(
      { categoryId, name, type, description },
      { transaction: t }
    );

    if (Array.isArray(priceOptions)) {
      const toCreate = priceOptions.map((po) => ({
        ...po,
        serviceId: service.id,
      }));
      await ServicePriceOption.bulkCreate(toCreate, { transaction: t });
    }

    await t.commit();
    const created = await Service.findByPk(service.id, {
      include: [{ model: ServicePriceOption, as: "priceOptions" }],
    });
    return res.status(201).json(created);
  } catch (err) {
    await t.rollback();
    return res.status(400).json({ message: err.message });
  }
};

// =============== get =================
exports.getServicesInCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const services = await Service.findAll({
      where: { categoryId },
      include: [{ model: ServicePriceOption, as: "priceOptions" }],
    });
    return res.json(services);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =============== delete =================
exports.deleteService = async (req, res) => {
  try {
    const { categoryId, serviceId } = req.params;
    const service = await Service.findOne({
      where: { id: serviceId, categoryId },
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    await service.destroy();
    return res.json({ message: "Service deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =============== update =================
exports.updateService = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { categoryId, serviceId } = req.params;
    const { name, type, description, priceOptions } = req.body;

    const service = await Service.findOne({
      where: { id: serviceId, categoryId },
      transaction: t,
    });
    if (!service) {
      await t.rollback();
      return res.status(404).json({ message: "Service not found" });
    }

    if (name !== undefined) service.name = name;
    if (type !== undefined) service.type = type;
    if (description !== undefined) service.description = description;
    await service.save({ transaction: t });

    if (Array.isArray(priceOptions)) {
      const existing = await ServicePriceOption.findAll({
        where: { serviceId: service.id },
        transaction: t,
      });
      const existingIds = existing.map((e) => e.id);

      const incomingIds = priceOptions.filter((p) => p.id).map((p) => p.id);

      const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
      if (toDelete.length) {
        await ServicePriceOption.destroy({
          where: { id: toDelete },
          transaction: t,
        });
      }

      for (const po of priceOptions) {
        if (po.id) {
          await ServicePriceOption.update(
            { duration: po.duration, price: po.price, type: po.type },
            { where: { id: po.id, serviceId: service.id }, transaction: t }
          );
        } else {
          await ServicePriceOption.create(
            {
              serviceId: service.id,
              duration: po.duration,
              price: po.price,
              type: po.type,
            },
            { transaction: t }
          );
        }
      }
    }

    await t.commit();

    const updated = await Service.findByPk(service.id, {
      include: [{ model: ServicePriceOption, as: "priceOptions" }],
    });
    return res.json(updated);
  } catch (err) {
    await t.rollback();
    return res.status(400).json({ message: err.message });
  }
};
