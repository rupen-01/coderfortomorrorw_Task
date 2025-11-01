const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const categoryController = require('../controller/category');
const serviceController = require('../controller/service');

// Category routes
router.post('/category', auth, categoryController.createCategory);
router.get('/categories', auth, categoryController.getAllCategories);
router.put('/category/:categoryId', auth, categoryController.updateCategory);
router.delete('/category/:categoryId', auth, categoryController.deleteCategory);

// Service routes under category
router.post('/category/:categoryId/service', auth, serviceController.addService);
router.get('/category/:categoryId/services', auth, serviceController.getServicesInCategory);
router.put('/category/:categoryId/service/:serviceId', auth, serviceController.updateService);
router.delete('/category/:categoryId/service/:serviceId', auth, serviceController.deleteService);

module.exports = router;
