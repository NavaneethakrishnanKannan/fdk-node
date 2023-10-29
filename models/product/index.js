const Product = require('./productModal');
exports.getProduct = async (id) => Product.findOne({ id }).lean();
