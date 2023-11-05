const mongoose = require('../../config/db');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	orderNo: {
		type: Number, 
		set: (val) => val
	},
	product: {
		type: Object,
		set: (val) => val
	},
	user: {
		type: Object,
		set: (val) => val
	},
	orderDate: {
		type: Date,
		set: (val) => val
	},
	deliveryDate: {
		type: Date,
		set: (val) => val
	},
	orderStatus: {
		type: String,
		enum: ['placed', 'shipped', 'delivered', 'returned'],
		default: 'placed',
	},
	returnstatus: {
		type: String,
		set: (val) => val
	},
	returneligible: {
		type: Boolean,
		set: (val) => val
	},
	otp: {
		type: Object,
		set: (val) => val,
		default: {}
	}

}, { toJSON: { getters: true } });

OrderSchema.index({ orderNo: "text" })
const Order = mongoose.model('order', OrderSchema);

module.exports = Order;