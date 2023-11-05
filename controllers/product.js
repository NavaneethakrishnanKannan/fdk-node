const productController = {};
const Product = require('../models/product');

/** Get the product information */
/** Params validated in the routed using JOI */
/**
 * 
 * @param {*} id 
 * @returns 
 */
productController.getProductData = async (id)  => {
    try {
        let productData = await Product.getProduct(id);
        if(productData) {
            return { status: 200, productData };
        }
    } catch (error) {
        return { status: 500, error };
    }
}

module.exports = productController;