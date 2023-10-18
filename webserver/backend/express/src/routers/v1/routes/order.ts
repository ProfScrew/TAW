import { Router } from "express";
import { iCourse , iOrder , Order } from "../../../models/order";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { iUser} from "../../../models/user";
import mongoose from "mongoose";

const orders = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

async function asOrder(data: unknown, next: Function): Promise<iOrder> {
    if (typeof data !== 'object') throw new Error("Invalid data type");
    if (data === null) throw new Error("Data is null");

    const { _id, courses, waiter, created_by, created_at } = data as iOrder;

    const order = await Order.find({ _id: _id }).orFail();

    if (!order) return next({statusCode: 400, error: true, errormessage: 'Bad request'});

    if(!!waiter && typeof waiter !== 'string'){
        return next({ statusCode: 400, error: true, errormessage: 'Bad request' });
    }

    if (!Array.isArray(courses) || typeof created_by !== 'string' || !(created_at instanceof Date)) {
        return next({ statusCode: 400, error: true, errormessage: 'Bad request' });
    }

    return data as iOrder;

}

orders.get("/", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    
    if (!role.canReadOrders) return next({statusCode: 403, error: true, errormessage: 'Forbidden'});

    Order.find().then(orders => {
        res.json(orders);
    }).catch(err => {
        res.status(500).json(err);
    });
});

orders.get("/:id", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    const id   = req.params.id;

    if (!role.canReadOrders)     return next({statusCode: 403, error: true, errormessage: 'Forbidden'});
    if (id === null) return next({statusCode: 400, error: true, errormessage: 'Bad request'});

    Order.findOne({ id: id }).orFail().then(order => {
        res.json(order);
    }).catch(err => {
        res.status(404).json(err);
    });
});

orders.put("/", authorize, async (req, res, next) => {
    try {
        const role = (req.user as iTokenData).role!;

        if (!role.canCreateOrders) return next({statusCode: 403, error: true, errormessage: 'Forbidden'});

        const orderData = await asOrder(req.body,next);
        
        Order.create(orderData).then(role => {
            res.json(role);
        }).catch(err => {
            res.status(500).json(err);
        });
    } catch (error) {
        next({statusCode: 500, error: true, errormessage: error});
    }
});

orders.delete("/:id", authorize, async (req, res, next) => {
    try {
        const role = (req.user as iTokenData).role!;
        const id = req.params.id;

        if (!role.canDeleteOrders) {
            return res.status(403).json({ error: true, errormessage: 'Forbidden' });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: true, errormessage: 'Bad request' });
        }

        const deletedOrder = await Order.deleteOne({ _id: id }).orFail();

        if (deletedOrder.deletedCount === 0) {
            return res.status(404).json({ error: true, errormessage: 'Order not found' });
        }

        res.json({ success: true, message: 'Order deleted successfully' });
        
    } catch (error) {
        next(error); 
    }
});

export default orders;  

