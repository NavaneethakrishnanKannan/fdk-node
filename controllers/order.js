const orderController = {};
const Order = require('../models/order');
const { formatDate, getDateDiff, addMinutes } = require('../utils/formatDate');
const { sentOTP } = require('../utils/otp');
const productController = require('./product');
const userController = require('./user');

orderController.placeOrder = async (orderData) => new Promise(async (resolve, reject) => {
    let { orderNo, userId, productId, orderDate, orderStatus, returnstatus, } = orderData;
    let user = await userController.getUserData(userId);
    let product = await productController.getProductData(productId);
    if (user.status === 200 && product.status === 200) {
        let deliveryDate = formatDate(orderDate, 3);
        let dateDiff = getDateDiff(deliveryDate, Date.now());
        let isReturenEligible = dateDiff > 3 ? false : true;
        let query = { "orderNo": orderNo, "product": product.productData, "user": user.userData, "orderDate": orderDate, "deliveryDate": deliveryDate, "orderStatus": orderStatus, "returnstatus": returnstatus, "returneligible": isReturenEligible, otp: "" };
        console.log(query, deliveryDate, dateDiff);
        Order.placeOrder(query).then(async order => {
            console.log("Order Placed")
            return resolve({ status: 200, msg: "Order Placed", data: order });
        }).catch(error => {
            console.log(error);
            return reject({ status: 500, error });
        })
    }
});

orderController.searchOrder = async (orderData) => new Promise(async (resolve, reject) => {
    let searchType = orderData.searchtype;
    let searchParams = orderData.searchParams;
    console.log(searchType, searchParams)
    let query = {};
    if (searchParams) {
        query = {
            $or: [
              { "user.email": { $regex: searchParams } },
              { "user.username": { $regex: searchParams } },
              { "title": { $regex: searchParams } },
              { "product.category": { $regex: searchParams } },
            ]
          }
          if(!isNaN(searchParams)) {
            query = { "orderNo": searchParams }
          }
    } else if (searchType) {
        query = { "orderStatus": searchType };
        if (searchType === "all") {
            query = {};
        }
    }
    console.log(query)
    Order.searchOrder(query).then(order => {
        // console.log(order);
        return resolve({ status: 200, data: order })
    }).catch(error => {
        console.log(error);
        return reject({ status: 500, error });
    })
});


orderController.sentOTP = async (orderNo) => new Promise(async (resolve, reject) => {
    let orderQuery = { "orderNo": Number(orderNo) };
    let orderData = await Order.searchOrder(orderQuery);
    if (!orderData.length) {
        return reject({ status: 500, msg: `Order Unavilable` });
    }
    let phone = orderData[0].user.phone;
    if (!phone) {
        return reject({ status: 500, msg: `Mobile Number Unavailable` });
    }
    phone = 9095068478;
    let otpResponse = sentOTP(phone);
    if (otpResponse.status === 200) {
        Order.updateOrder({ orderNo }, { $set: { "otp": { otp: otpResponse.otp, expire: addMinutes(10, new Date()) } } }).then(otpRes => {
            console.log(otpRes, "OTP Completed...");
            return resolve({ status: 200, otp_for_test: otpResponse.otp, msg: `OTP Sent to ${phone}` });
        }).catch(error => {
            console.log(error);
            return reject({ status: 500, msg: `OTP Failed, Please Check the mobile Number -  ${phone}` });
        })
    } else {
        return reject({ status: 500, msg: `OTP Failed, Please Check the mobile Number -  ${phone}` });
    }
});

orderController.validateOTP = async (orderNo, otp) => new Promise(async (resolve, reject) => {
    let orderQuery = { "orderNo": Number(orderNo) };
    let orderData = await Order.searchOrder(orderQuery);
    if (!orderData.length) {
        return reject({ status: 500, msg: `Order Unavilable` });
    }
    let otpObj = orderData[0].otp;
    if (!otpObj.otp || !otpObj.expire) {
        return reject({ status: 500, msg: `OTP Expired or Invalid Request` });
    }
    if (otpObj.expire > Date.UTC(new Date())) {
        return reject({ status: 500, msg: `OTP Expired` });
    }
    console.log({ otpObj, otp })
    if (otpObj.otp !== otp) {
        return reject({ status: 500, msg: `Invalid OTP` });
    }
    console.log(otpObj);
    Order.updateOrder({ orderNo }, { $set: { "otp": { otp: "", expire: "" }, "returnstatus": "return initiated", "orderStatus": "returned", returneligible: false } }).then((updateResponse) => {
        // console.log(updateResponse, "Updated");
        return resolve({ status: 200, msg: `Return Request Accepted` });
    }).catch(error => {
        console.log(error);
        return reject({ status: 500, msg: `Return Request Failed` });
    })

})

module.exports = orderController;