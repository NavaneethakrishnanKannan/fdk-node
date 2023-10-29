const User = require('./userModal');
exports.getUser = async (id) => User.findOne({ id }).lean();