const orderController = {};
const Order = require('../models/order');
const { formatDate, getDateDiff, addMinutes } = require('../utils/formatDate');
const { sentOTP } = require('../utils/otp');
const productController = require('./product');
const userController = require('./user');

/** To place a new order. This is Created only for a Internal use. I haven't Implemented UI for this. I did Using the Postman. Because I have taken User and Product the data from fake-store API Here I'm Placing the order */
/** Param Order Data is an Object. Have validated in routes */
/**
 * 
 * @param {*} orderData 
 * @returns 
 */
orderController.placeOrder = async (orderData) => {
    try {
        let { orderNo, userId, productId, orderDate, orderStatus, returnstatus, } = orderData;
        let user = await userController.getUserData(userId);
        let product = await productController.getProductData(productId);
        if (user.status === 200 && product.status === 200) {
            let deliveryDate = formatDate(orderDate, 3);
            let dateDiff = getDateDiff(deliveryDate, Date.now());
            let isReturenEligible = dateDiff > 3 ? false : true;
            let query = { "orderNo": orderNo, "product": product.productData, "user": user.userData, "orderDate": orderDate, "deliveryDate": deliveryDate, "orderStatus": orderStatus, "returnstatus": returnstatus, "returneligible": isReturenEligible, otp: "" };
            let order = await Order.placeOrder(query);
            console.log(order)
            if (order) {
                return { status: 200, msg: "Order Placed", data: order };
            }
        } else {
            return { status: 500, error: user.error, productError: product.error };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, error };
    }
};

/** Get the products from the collection */
/** Dynamic Params Based on Search Value for Example: searchtype=all&searchParams=<string/num> */
/**
 * 
 * @param {*} orderData 
 * @returns 
 */

orderController.searchOrder = async (orderData) => {
    try {
        let searchType = orderData.searchtype;
        let searchParams = orderData.searchParams;
        let query = {};
        if (searchParams) {
            query = {
                $or: [
                    { "user.email": { $regex: searchParams, $options: 'i' } },
                    { "user.username": { $regex: searchParams, $options: 'i' } },
                    { "product.title": { $regex: searchParams, $options: 'i' } },
                    { "product.category": { $regex: searchParams, $options: 'i' } },
                ]
            }
            if (!isNaN(searchParams)) {
                query = { "orderNo": searchParams }
            }
        } else if (searchType) {
            query = { "orderStatus": searchType };
            if (searchType === "all") {
                query = {};
            }
        }
        let order = await Order.searchOrder(query);
        return { status: 200, data: order };
    } catch (error) {
        console.log(error);
        return { status: 500, error };
    }
}

/** For validating the user. Have used Twillio Api for OTP Purpose - Real time OTP, and OTP will send as SMS to Registered Mobile Number. OTP ONLY VALID FOR 10 MINS */
/**
 * 
 * @param {*} orderNo 
 * @returns 
 */

orderController.sentOTP = async (orderNo) => {
    try {
        let orderQuery = { "orderNo": Number(orderNo) };
        let orderData = await Order.searchOrder(orderQuery);
        if (!orderData.length) {
            return { status: 500, msg: `Order Unavilable` };
        }
        let phone = orderData[0].user.phone;
        if (!phone) {
            return { status: 500, msg: `Mobile Number Unavailable` };
        }
        phone = "+919095068478";
        let otpResponse = sentOTP(phone);
        if (otpResponse.status === 200) {
            let order = await Order.updateOrder({ orderNo }, { $set: { "otp": { otp: otpResponse.otp, expire: addMinutes(10, new Date()) } } });
            if (order) {
                return { status: 200, otp_for_test: otpResponse.otp, msg: `OTP Sent to ${phone}` };
            }
        } else {
            return { status: 500, msg: `OTP Failed, Please Check the mobile Number -  ${phone}` };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, msg: `OTP Failed, Please Check the mobile Number -  ${phone}` };
    }
}

/** Validating the OTP */
/**
 * 
 * @param {*} orderNo 
 * @param {*} otp 
 * @returns 
 */

orderController.validateOTP = async (orderNo, otp) => {
    try {

        let orderQuery = { "orderNo": Number(orderNo) };
        let orderData = await Order.searchOrder(orderQuery);
        if (!orderData.length) {
            return { status: 500, msg: `Order Unavilable` };
        }
        let otpObj = orderData[0].otp;
        if (!otpObj.otp || !otpObj.expire) {
            return { status: 500, msg: `OTP Expired or Invalid Request` };
        }
        if (otpObj.expire > Date.UTC(new Date())) {
            return { status: 500, msg: `OTP Expired` };
        }
        if (otpObj.otp !== otp) {
            return { status: 500, msg: `Invalid OTP` };
        }
        console.log(otpObj);
        let order = await Order.updateOrder({ orderNo }, { $set: { "otp": { otp: "", expire: "" }, "returnstatus": "return initiated", "orderStatus": "returned", returneligible: false } })
        if (order) {
            return { status: 200, msg: `Return Request Accepted` };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, msg: `Return Request Failed` };
    }

}
module.exports = orderController;