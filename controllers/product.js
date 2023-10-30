const productController = {};
const Product = require('../models/product');

/** Get the product information */
/** Params validated in the routed using JOI */
/**
 * 
 * @param {*} id 
 * @returns 
 */
productController.getProductData = async (id) => new Promise((resolve, reject) => {
    Product.getProduct(id).then(productData => {
        return resolve({ status: 200, productData });
    }).catch(error => {
        console.log(error);
        return reject({ status: 500, error });
    })
})

module.exports = productController;