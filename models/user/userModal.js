const mongoose = require('../../config/db');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        set: (val) => val
    },
    name: {
        type: Object,
        set: (val) => val
    },
    email: {
        type: String,
		unique: true,
		set: (email) => email.toLowerCase().trim()
    },
    password: {
        type: String,
		set: (pass) => bcrypt.hashSync(pass, 10),
		get: () => '*********',
    },
    phone: {
        type: Number,
        set: (val) => val
    },
    username: {
        type: String,
        set: (val) => val
    },
}, { toJSON: { getters: true } });

const User = mongoose.model('user', UserSchema);

module.exports = User;