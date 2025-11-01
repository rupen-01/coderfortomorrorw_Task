const { Category, Service } = require("../models/index");

// =============== create =================
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const cat = await Category.create({ name });
    return res.status(201).json(cat);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// =============== get all =================
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Service, as: "services", attributes: ["id"] }],
    });
    const result = categories.map((c) => ({
      id: c.id,
      name: c.name,
      servicesCount: c.services ? c.services.length : 0,
      createdAt: c.createdAt,
    }));
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =============== update =================
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    cat.name = name ?? cat.name;
    await cat.save();
    return res.json(cat);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// =============== delete =================
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const cat = await Category.findByPk(categoryId, {
      include: [{ model: Service, as: "services" }],
    });
    if (!cat) return res.status(404).json({ message: "Category not found" });
    if (cat.services && cat.services.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with services" });
    }
    await cat.destroy();
    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
