import { Router } from "express";
import { Order,iOrder, verifyOrderData } from "../../../models/order.model";
import { authorize, iTokenData,  } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import mongoose from "mongoose";

const orders = Router();


/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Orders management
 */


/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get orders list, if id is provided, get the specific order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the order to get.
 *     responses:
 *       200:
 *         description: Orders list
 *       500:
 *         description: Internal server error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
orders.get("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter || requester.role.production || requester.role.cashier)){
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }

    const id = req.query.id as string;

    const query : any = id ? { _id: id } : {};

    Order.find(query).then((data) => {
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

orders.post("/", (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter)){
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }

    const orderData = req.body as iOrder;
    if (!verifyOrderData(orderData)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Data not valid'));
    }
    const order = new Order(orderData);

    order.save().then((data) => {
        return next(cResponse.success(eHttpCode.CREATED, { id: data._id }));
    }).catch((reason: { code: number, errmsg: string }) => {
        if (reason.code === 11000) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Order already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
    });
});

orders.put("/", (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter || requester.role.production || requester.role.cashier)){
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }

    return next(cResponse.error(eHttpCode.OK, "Not implemented yet."));

});

orders.delete("/", (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter || requester.role.production || requester.role.cashier)){
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    return next(cResponse.error(eHttpCode.OK, "Not implemented yet."));

});

export default orders;