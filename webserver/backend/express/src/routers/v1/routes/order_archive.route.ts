import { Router } from "express";

import { iUserAction, UserAction } from "../../../models/user_action.object";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import mongoose, { isValidObjectId, Query } from "mongoose";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import { iCourseArchive, iDishArchive, iDishModificationArchive, iOrderArchive, OrderArchive } from "../../../models/order_archive.model";
import { iCourse, iOrder, Order } from "../../../models/order.model";
import { Dish, eDishModificationType, iDishModification } from "../../../models/dish.model";
import { iIngredient, Ingredient } from "../../../models/ingredient.model";
import { Table , eTableStatus } from "../../../models/table.model";
import { RestaurantInformation } from "../../../models/restaurant_information.model";

const order_archives = Router();

/**
 * @swagger
 * tags:
 *   name: Order Archives
 *   description: Order Archives management
 */

/**
 * @swagger
 * /order_archives:
 *   get:
 *     tags:
 *       - Order Archives
 *     summary: Get archived orders or a specific archived order by ID.
 *     description: Access archived orders or a specific archived order by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the specific archived order to retrieve (optional).
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of archived orders or a specific archived order.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderArchive'
 *       403:
 *         description: Forbidden. You are not allowed to access this resource.
 *       500:
 *         description: Internal Server Error. There was an error accessing the database.
 */
order_archives.get("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);

    if (!(requester.role.analytics)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You are not allowed to access this resource"));
    }

    const id = req.query.id as string;

    const query: any = id ? { _id: id } : {};

    OrderArchive.find(query).then((order_archives) => {
        return next(cResponse.success(eHttpCode.OK, order_archives));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });

});

/**
 * @swagger
 * /order_archives/{id}:
 *   post:
 *     tags:
 *       - Order Archives
 *     summary: Archive an order by its ID.
 *     description: Archives an order and its associated details based on the provided order ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be archived.
 *     responses:
 *       200:
 *         description: Order successfully archived.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderArchive'
 *       400:
 *         description: Bad request. Invalid order ID or missing data.
 *       403:
 *         description: Forbidden. User not allowed to access this resource.
 *       404:
 *         description: Order not found or data not present for archiving.
 *       500:
 *         description: Internal Server Error. Error in archiving the order.
 */


order_archives.post("/:id", authorize, async (req, res, next) => {

    const requester = req.user as iTokenData;
    if (!(requester.role.analytics || requester.role.cashier)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You are not allowed to access this resource"));
    }

    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid order ID'));
    }

    const order = await Order.findById(mongoose.Types.ObjectId(id)).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });

    //Check if the order exists
    if (!order) {
        return next(cResponse.error(eHttpCode.NOT_FOUND, 'Order not found'));
    }
    if(order.courses.length === 0){
        return next(cResponse.error(eHttpCode.NOT_FOUND, 'Order is empty'));
    }

    // Retrieve the table names associated with the order
    const tablesName = [];
    for (const table of order.tables) {
        const foundTable = await Table.findById(table).catch((err) => {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
        });
        if (foundTable) {
            tablesName.push(foundTable.name);
        }
    }

    // Calculate the charges per person based on the number of guests and the restaurant information charge per person
    let chargesPersonToArchive = 0;
    const restaurantInformation = await RestaurantInformation.findOne().catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });
    chargesPersonToArchive = restaurantInformation?.charge_per_person! * order.guests;

    const coursesToArchive = [];
    for (const course of order.courses) {
        if(!course.logs_course?.served_course){
            return next(cResponse.error(eHttpCode.NOT_FOUND, 'Course not served'));
        }
        const dishesToArchive = [];
        for (const dishId of course.dishes) {
            const dish = await Dish.findById(dishId).catch((err) => {
                return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
            });
            //check if dish exists
            if (!dish) {
                return next(cResponse.error(eHttpCode.NOT_FOUND, 'Dish not found'));
            }
            if(!dish.logs_status?.finish_cooking){
                return next(cResponse.error(eHttpCode.NOT_FOUND, 'Dish not finished'));
            }

            // Prepare an array to store dish modifications
            const dishModificationToArchive = [];
            for (const modification of dish?.modifications!) {
                const ingredient = await Ingredient.findById(modification.ingredient).catch((err) => {
                    return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
                });
                if (ingredient) {
                    let dishModificationPrice = 0;
                    //Calculate dish modification price based on the type of modification
                    if (modification.type === eDishModificationType.add || modification.type === eDishModificationType.remove) {
                        dishModificationPrice = modification.type === eDishModificationType.add ? ingredient.modification_price : -ingredient.modification_price;
                    } else {
                        dishModificationPrice = modification.type === eDishModificationType.more ?
                            (ingredient.modification_price * ingredient.modification_percentage / 100) :
                            (-ingredient.modification_price * ingredient.modification_percentage / 100);
                    }
                    //Store dish modification information
                    dishModificationToArchive.push({
                        ingredient: modification.ingredient as iIngredient['_id'],
                        type: modification.type,
                        price: dishModificationPrice,
                    });
                }else{
                    return next(cResponse.error(eHttpCode.NOT_FOUND, 'Ingredient not found'));
                    //Managment for this case not implemented
                }
            }

            //Store dish information
            dishesToArchive.push({
                recipe: dish.recipe,
                actual_price: dish.actual_price,
                notes: dish.notes,
                logs_status: dish.logs_status ? {
                    start_cooking: dish.logs_status.start_cooking,
                    finish_cooking: dish.logs_status.finish_cooking,
                } : undefined,
                modifications: dishModificationToArchive,
            });
        }

        //Store course information
        coursesToArchive.push({
            logs_course: {
                created_course: course?.logs_course!.created_course,
                served_course: course?.logs_course!.served_course,
                deleted_course: course?.logs_course!.deleted_course,
            },
            dishes: dishesToArchive,
        });
    }



    const newOrder : Partial<iOrderArchive> = {
        guests: order.guests,
        capacity: order.capacity,
        logs_order: {
            created_order: order?.logs_order!.created_order,
        },
        final_price: order.final_price? order.final_price : 0,
        courses: coursesToArchive,
        tables: tablesName,
        charges_persons: chargesPersonToArchive,
    };
    
    //Create the order archive
    const orderArchive = await OrderArchive.create(newOrder).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });


    //change status of tables to free
    for(const table of order.tables){
        await Table.findByIdAndUpdate(table, {status: eTableStatus.free}).catch((err: any) => {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
        });
    }

    //Cascade delete the order and its dishes

    for(const course of order.courses){
        for(const dishId of course.dishes){
            await Dish.findByIdAndDelete(dishId).catch((err) => {
                return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
            });
        }
    }


    await order.delete().catch((err: any) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });
    //NOTE: IF ORDER BREAKS AROUND HERE, GOOD LUCK... YOU WILL NEED IT
    //TODO: implement a better way to handle errors...future me will do it maybe
    
    //implementation idea:
    // if it fails then we have problems with database
    // so we should have a copy saved somewhere (maybe reddis if its up or internal file inside the server)
    // so push copies to reddis/file that will help recover the data
    // when databse is up again, we can recover the data from reddis/file and save it to database

    return next(cResponse.success(eHttpCode.OK, orderArchive));

});

/**
 * @swagger
 * /order_archives/{id}:
 *   put:
 *     tags:
 *       - Order Archives
 *     summary: Update an archived order by ID.
 *     description: This operation is not yet implemented.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the archived order to be updated.
 *     responses:
 *       501:
 *         description: Not implemented. The operation is not yet available.
 */


order_archives.put("/:id", authorize, async (req, res, next) => {
    return next(cResponse.error(eHttpCode.NOT_IMPLEMENTED, "Not implemented"));
});


/**
 * @swagger
 * /order_archives/{id}:
 *   delete:
 *     tags:
 *       - Order Archives
 *     summary: Delete an archived order by ID.
 *     description: Deletes an archived order based on the provided ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the archived order to be deleted.
 *     responses:
 *       200:
 *         description: Archived order successfully deleted.
 *       400:
 *         description: Bad request. Invalid ID provided.
 *       403:
 *         description: Forbidden. User not allowed to access this resource.
 *       404:
 *         description: Order archive not found.
 *       500:
 *         description: Internal Server Error. Error in deleting the order archive.
 */


order_archives.delete("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!(requester.role.analytics)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You are not allowed to access this resource"));
    }
    const id = req.params.id as string;

    if (isValidObjectId(id) === false) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Invalid id"));
    }

    OrderArchive.findByIdAndDelete(mongoose.Types.ObjectId(id)).then((order_archive) => {
        if (!order_archive) {
            return next(cResponse.error(eHttpCode.NOT_FOUND, "Order archive not found"));
        }
        return next(cResponse.genericMessage(eHttpCode.OK, "Order archive successfully deleted"));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });

});

export default order_archives;