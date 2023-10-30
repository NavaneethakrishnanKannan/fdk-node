const userController = {};
const User = require('../models/user');

/** Get the user info */
/** Params validated in the routed using JOI */
/**
 * 
 * @param {*} id 
 * @returns 
 */
userController.getUserData = async (id) => new Promise((resolve, reject) => {
    User.getUser(id).then(userData => {
        return resolve({ status: 200, userData });
    }).catch(error => {
        console.log(error);
        return reject({ status: 500, error });
    })
})

module.exports = userController;