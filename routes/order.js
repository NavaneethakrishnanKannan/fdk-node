const router = require('express').Router();
const orderController = require('../controllers/order');
const { celebrate, errors, Joi } = require('celebrate');


/** Place the New Order. Params are Validated Using JOI */
router.post('/placeorder', celebrate({
    body: Joi.object().keys({
        orderNo: Joi.number().required(),
        productId: Joi.number().required(),
        userId: Joi.number().required(),
        orderDate: Joi.date().required(),
        deliveryDate: Joi.date().required().greater(Date.now()),
        orderStatus: Joi.string().required(),
        returnstatus: Joi.string().optional().allow(""),
        returneligible: Joi.boolean().required(),
        otp: Joi.object().optional().allow({}),
    })
}), errors(), (request, response) => {
    orderController.placeOrder(request.body).then(result => {
        response.status(result.status).json(result);
    }, err => {
        console.log(err);
        response.status(err.status).json(err);
    });
});

/** Get all or filtered Date from the Collection. Params are Validated Using JOI */
/**
 * @param searchtype
 * @param searchParams
 */
router.get("/search", celebrate({
    query: {
        searchtype: Joi.string().optional().valid("returned", "placed", "delivered", "all"),
        searchParams: Joi.string().optional().allow(""),
    }
}), errors(), (request, response) => {
    orderController.searchOrder(request.query).then(result => {
        response.status(result.status).json(result);
    }, err => {
        console.log(err);
        response.status(err.status).json(err);
    })
});

/** This route for genetrate the otp for validate the user. Params are Validated Using JOI*/
/**
 * @param orderNo
 */
router.get("/generateotp", celebrate({
    query: {
        orderNo: Joi.string().required(),
    }
}), errors(), (request, response) => {
    orderController.sentOTP(request.query.orderNo).then(result => {
        response.status(result.status).json(result);
    }, err => {
        console.log(err);
        response.status(err.status).json(err);
    });
});

/** This route for validate the otp.  Params are Validated Using JOI */
/**
 * @param orderNo
 * @param otp
 */
router.get("/validateotp", celebrate({
    query: {
        orderNo: Joi.string().required(),
        otp: Joi.string().required(),
    }
}), errors(), (request, response) => {
    orderController.validateOTP(request.query.orderNo, request.query.otp).then(result => {
        console.log(result)
        response.status(result.status).json(result);
    }, err => {
        console.log(err);
        response.status(err.status).json(err);
    }).catch(err => {
        console.log(err);
        response.status(err.status).json(err);
    });
});

module.exports = router;