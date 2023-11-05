const userController = {};
const User = require('../models/user');

/** Get the user info */
/** Params validated in the routed using JOI */
/**
 * 
 * @param {*} id 
 * @returns 
 */
userController.getUserData = async (id) => {
    try {
        let userData = await User.getUser(id);
        if(userData) {
            return { status: 200, userData };
        }
    } catch (error) {
        return { status: 500, error };
    }
}
module.exports = userController;