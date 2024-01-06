import e, { Router } from "express";
import { Order, eOrderStatus, iOrder, verifyOrderData, verifyPartialOrderData } from "../../../models/order.model";
import { authorize, iTokenData, } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import mongoose, { isValidObjectId } from "mongoose";
import { iUserAction } from "../../../models/user_action.object";
import { Table, eTableStatus } from "../../../models/table.model";
import { io } from "../../../app";
import { eListenChannels } from "../../../models/channels.enum";

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
    if (!(requester.role.waiter )) {
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

    //change tables status to busy

    const tables = order.tables;
    for (const table of tables) {
        Table.findByIdAndUpdate(table, { status: eTableStatus.busy }).then((data: any) => {
            io.emit(eListenChannels.tables, { message: 'Table list updated!' });
        }).catch((err: any) => {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
        });
    }
    order.save().then((data) => {
        io.emit(eListenChannels.orders, { message: 'Order list updated!' });
        return next(cResponse.genericMessage(eHttpCode.CREATED, { id: data._id }));
    }).catch((reason: { code: number, errmsg: string }) => {
        if (reason.code === 11000) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Order already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason));
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
 *         description: Provide one values in this list. [ordering, waiting, serving, {course_id}]
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

    /*
        cases:
            - ordering:
                cambiare stato e basta
            - waiting:
                cambiare stato e basta

            - serving:
                cambiare stato e basta (no body)
            - serving: (il waiter ha inserito corsi e li ha mandati in cucina)
                ci sono dati
                    -mettere log di creazione
            
            - serving specific course:
                mando id del corso servito
                    -mettere log di servizio

                if tutti i corsi sono serviti
                allora cambia a delivered

            - delivered
                cambiare stato e basta 
                


    */

    const requester = (req.user as iTokenData);
    if (!(requester.role.waiter || requester.role.production)) {
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
    if (choice == eOrderStatus.waiting || choice == eOrderStatus.ordering || choice == eOrderStatus.delivered) { // case ordering an waiting (simple status change)
        Order.updateOne({ _id: mongoose.Types.ObjectId(id) }, { status: choice as eOrderStatus }).then((data) => {
            io.emit(eListenChannels.orders, { message: 'Order list updated!' });
            return next(cResponse.genericMessage(eHttpCode.OK));
        }
        ).catch((reason: { code: number, errmsg: string }) => {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
        });
    } else if (choice == eOrderStatus.serving && Object.keys(orderData).length === 0) { // case serving (simple status change)
        Order.updateOne({ _id: mongoose.Types.ObjectId(id) }, { status: choice as eOrderStatus }).then((data) => {
            io.emit(eListenChannels.orders, { message: 'Order list updated!' });
            return next(cResponse.genericMessage(eHttpCode.OK));
        }).catch((reason: { code: number, errmsg: string }) => {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
        });
    } else {
        if (choice !== eOrderStatus.serving) { //case where i change a specific course to served through logs
            if (isValidObjectId(choice) === false) {
                return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid order ID'));
            }
            for (const course of orderData.courses!) {
                if (course._id.toString() === choice) {
                    if(course.logs_course?.ready_course === undefined){
                        course.logs_course!.ready_course = requesterAction;
                        //emit signal for waiters that the order is ready to serve
                        //send notification to waiters
                        io.emit(eListenChannels.orderReady, { message: 'Added' });
                    }else{
                        course.logs_course!.served_course = requesterAction;

                        io.emit(eListenChannels.orderReady, { message: 'Deleted' });
                    }
                }
            }
            
            orderData.status = eOrderStatus.delivered;
            for (const course of orderData.courses!) {
                if (course.logs_course?.served_course === undefined) {
                    orderData.status = eOrderStatus.serving;
                }
            }
        } else if (choice === eOrderStatus.serving) { // im adding new courses to the order
            orderData.status = eOrderStatus.serving;
            for (const course of orderData.courses!) {
                if (course.logs_course?.created_course === undefined) {
                    course.logs_course = { created_course: requesterAction };
                }
            }
        }


        if (!verifyPartialOrderData(orderData)) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Data not valid'));
        }

        //const order = new Order(orderData as iOrder);
        Order.updateOne({ _id: mongoose.Types.ObjectId(id) }, orderData).then((data) => {
            io.emit(eListenChannels.orders, { message: 'Order list updated!' });
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
    if (!(requester.role.cashier)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    const id = req.params.id as string;

    if (isValidObjectId(id) === false) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid order ID'));
    }

    Order.findOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
        if (data!.status === eOrderStatus.waiting) {
            Order.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
                io.emit(eListenChannels.orders, { message: 'Order list updated!' });
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