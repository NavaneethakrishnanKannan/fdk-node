const productController = {};
const Product = require('../models/product');

productController.getProductData = async (id) => new Promise((resolve, reject) => {
    Product.getProduct(id).then(productData => {
        return resolve({ status: 200, productData });
    }).catch(error => {
        console.log(error);
        return reject({ status: 500, error });
    })
})

module.exports = productController;