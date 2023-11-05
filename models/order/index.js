const Order = require('./orderModal');
exports.placeOrder = async (orderData) => Order.create(orderData);
exports.searchOrder = async (query) => Order.find(query);
exports.updateOrder = async (find, update) => Order.findOneAndUpdate(find, update);
