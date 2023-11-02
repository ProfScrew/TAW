import { Router } from "express";
import { Order, eOrderStatus, iCourse, iOrder, verifyOrderData, verifyPartialOrderData } from "../../../models/order.model";
import { authorize, iTokenData, } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import mongoose, { Schema, isValidObjectId } from "mongoose";
import { iUserAction } from "../../../models/user_action.object";
import { eTableStatus } from "../../../models/table.model";

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
 *     tags: [Orders]
 *     summary: Get a list of orders or a specific order by ID.
 *     description: Get a list of orders or a specific order by ID from the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the specific order to retrieve (choiceal).
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of orders or a specific order.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. You don't have permission to access orders.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */
orders.get("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!(requester.role.waiter || requester.role.production || requester.role.cashier)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }

    const id = req.query.id as string;

    const query: any = id ? { _id: id } : {};

    Order.find(query).then((data) => {
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});


/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order.
 *     description: Create a new order in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Order data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Bad request. Invalid order data or order already exists.
 *       403:
 *         description: Forbidden. You don't have permission to create an order.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */
orders.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!(requester.role.waiter)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }

    var orderData = req.body as iOrder;
    const requesterAction: iUserAction = {
        actor: {
            username: requester.username,
            name: requester.name,
            surname: requester.surname,
        },
        timestamp: new Date(Date.now()),
    }
    orderData.logs_order = { created_order: requesterAction };

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


/**
 * @swagger
 * /orders/{id}/action/{choice}:
 *   put:
 *     tags: [Orders]
 *     summary: Update the status of an existing order.
 *     description: Update the status of an existing order in the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update.
 *       - in: path
 *         name: choice
 *         required: true
 *         schema:
 *           type: string
 *         description: Provide one values in this list. none, waiting, served, delivered,ID course to delete.
 *     requestBody:
 *       description: Order data for the update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully.
 *       400:
 *         description: Bad request. Invalid order data or order already exists.
 *       403:
 *         description: Forbidden. You don't have permission to update orders.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */

orders.put("/:id/action/:choice", authorize, (req, res, next) => {

    const requester = (req.user as iTokenData);
    if (!(requester.role.waiter)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    const id = req.params.id as string;

    if (isValidObjectId(id) === false) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid order ID'));
    }

    var orderData = req.body as Partial<iOrder>;
    const requesterAction: iUserAction = {
        actor: {
            username: requester.username,
            name: requester.name,
            surname: requester.surname,
        },
        timestamp: new Date(Date.now()),
    }

    const choice = req.params.choice as string;
    if (Object.values(eOrderStatus).includes(choice as eOrderStatus)) {
        Order.updateOne({ _id: mongoose.Types.ObjectId(id) }, { status: choice as eOrderStatus }).then((data) => {
            return next(cResponse.genericMessage(eHttpCode.OK));
        }
        ).catch((reason: { code: number, errmsg: string }) => {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
        });
    } else {
        if (choice !== "none") {
            if (isValidObjectId(choice) === false) {
                return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid order ID'));
            }
        }


        if (orderData.courses !== undefined) {
            for (const course in orderData.courses) {//🤔 JS is stupid
                if (choice !== "none") {
                    if (choice === orderData.courses[course]._id.toString()) {
                        orderData.courses[course].logs_course!.deleted_course = requesterAction;
                    }
                } else {
                    if (orderData.courses[course].logs_course?.created_course === undefined) {
                        orderData.courses[course].logs_course = { created_course: requesterAction };
                    } else if (orderData.courses[course].logs_course?.served_course === undefined) {
                        orderData.courses[course].logs_course!.served_course = requesterAction;
                    }
                }
            }
        }

        if (!verifyPartialOrderData(orderData)) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Data not valid'));
        }

        //const order = new Order(orderData as iOrder);
        Order.updateOne({ _id: mongoose.Types.ObjectId(id) }, orderData).then((data) => {
            return next(cResponse.genericMessage(eHttpCode.OK));
        }).catch((reason: { code: number, errmsg: string }) => {
            if (reason.code === 11000) {
                return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Order already exists'));
            }
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
        });
    }

});


/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an existing order by ID.
 *     description: Delete an existing order in the system by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to delete.
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *       400:
 *         description: Bad request. Order cannot be deleted (already has courses) or invalid order ID.
 *       403:
 *         description: Forbidden. You don't have permission to delete orders.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */
orders.delete("/:id", authorize, (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!(requester.role.waiter)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    const id = req.params.id as string;

    if (isValidObjectId(id) === false) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid order ID'));
    }

    Order.findOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
        if (data!.status === eOrderStatus.waiting) {
            Order.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
                return next(cResponse.genericMessage(eHttpCode.OK));
            }).catch((reason: { code: number, errmsg: string }) => {
                return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
            });
        } else {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Order cannot be deleted(already has courses)'));
        }
    });

});

export default orders;