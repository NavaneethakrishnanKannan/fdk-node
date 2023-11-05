const mongoose = require('../../config/db');
const Schema = mongoose.Schema;

var SchemaTypes = Schema.Types;

const ProductSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        set: (val) => val
    },
    title: {
        type: String,
        set: (val) => val
    },
    price: {
        type: SchemaTypes.Decimal128,
        set: (val) => val
    },
    description: {
        type: String,
        set: (val) => val,
    },
    category: {
        type: String,
        set: (val) => val
    },
    image: {
        type: String,
        set: (val) => val
    },
    rating: {
        type: Object,
    }
}, { toJSON: { getters: true } });

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;