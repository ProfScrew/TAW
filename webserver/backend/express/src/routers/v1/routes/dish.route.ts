import { Router } from "express";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import { Dish, eDishStatus, iDish, verifyDishData } from "../../../models/dish.model";
import mongoose from "mongoose";
import { iUserAction } from "../../../models/user_action.object";



const dishes = Router();

/**
 * @swagger
 * tags:
 *  name: Dishes
 * description: Dishes management
 */

/**
 * @swagger
 * /dishes:
 *   get:
 *     tags: [Dishes]
 *     summary: Retrieve dishes.
 *     description: Retrieve a list of dishes from the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the dish to retrieve (optional).
 *     responses:
 *       200:
 *         description: A list of dishes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dish'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. You don't have permission to access dishes.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */
dishes.get("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!(requester.role.waiter || requester.role.production || requester.role.cashier)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    const id = req.query.id as string;

    let query: any = id ? { _id: id } : {};

    Dish.find(query).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }
    ).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});
/**
 * @swagger
 * /dishes:
 *   post:
 *     tags: [Dishes]
 *     summary: Create a new Dish/Dishes.
 *     description: Create a new Dish/Dishes in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dish data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DishArray'
 *     responses:
 *       200:
 *         description: Dish/Dishes created successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. You don't have permission to create a dish.
 *       400:
 *         description: Bad request. Invalid dish data.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */
dishes.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!(requester.role.waiter)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }

    const dishData = req.body as [iDish];
    for (const dish of dishData) {
        if (!verifyDishData(dish)) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, "Invalid dish data."));
        }
    }

    Dish.insertMany(dishData).then((data) => {
        return next(cResponse.success(eHttpCode.CREATED, data.map((dish) => dish._id)));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });

});

/**
 * @swagger
 * /dishes/{id}/action/{type}:
 *   put:
 *     tags: [Dishes]
 *     summary: Update an existing Dish.
 *     description: Update an existing Dish in the system by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the dish to update.
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         description: The type of action to perform.
 *         schema:
 *           type: string
 *           enum:
 *             - start_cooking
 *             - finish_cooking
 *     responses:
 *       200:
 *         description: Dish updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. You don't have permission to update a dish.
 *       400:
 *         description: Bad request. Invalid dish data.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */

dishes.put("/:id/action/:type", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!( requester.role.production)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    const id = req.params.id as string;
    const type = req.params.type as string;
    if (!['start_cooking', 'finish_cooking'].includes(type)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Invalid action type."));
    }

    const requesterAction: iUserAction = {
        actor: {
            username: requester.username,
            name: requester.name,
            surname: requester.surname,
        },
        timestamp: new Date(Date.now())
    };

    Dish.findOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
        if (!data) {
            return next(cResponse.error(eHttpCode.NOT_FOUND, "Dish not found."));
        }
        if (type === 'start_cooking') {
            if (data.logs_status?.start_cooking === undefined) {
                // start cooking
                Dish.updateOne({ _id: mongoose.Types.ObjectId(id) }, { status: eDishStatus.working, 'logs_status.start_cooking': requesterAction }).then((data) => {
                    if (data.n === 0) {
                        return next(cResponse.error(eHttpCode.NOT_FOUND, "Dish not found."));
                    }
                    return next(cResponse.success(eHttpCode.OK, data));
                }).catch((err) => {
                    return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
                });
            } else {
                return next(cResponse.error(eHttpCode.BAD_REQUEST, "Dish already started cooking."));
            }
        } else if (type === 'finish_cooking') {
            if (data.logs_status?.finish_cooking === undefined) {
                // finish cooking
                Dish.updateOne({ _id: mongoose.Types.ObjectId(id) }, { status: eDishStatus.ready,'logs_status.finish_cooking': requesterAction }).then((data) => {
                    if (data.n === 0) {
                        return next(cResponse.error(eHttpCode.NOT_FOUND, "Dish not found."));
                    }
                    return next(cResponse.success(eHttpCode.OK, data));
                }).catch((err) => {
                    return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
                });
            } else {
                return next(cResponse.error(eHttpCode.BAD_REQUEST, "Dish already finished cooking."));
            }
        }
    }).catch((err) => { 
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg)); 
    });


});

/**
 * @swagger
 * /dishes/{id}:
 *   put:
 *     tags: [Dishes]
 *     summary: Update an existing Dish.
 *     description: Update an existing Dish in the system by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the dish to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Dish data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       200:
 *         description: Dish updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. You don't have permission to update a dish.
 *       400:
 *         description: Bad request. Invalid dish data.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */

dishes.put("/:id", authorize, async (req, res, next) => { //not used by the frontend(implemented for future use maybe)
    const requester = (req.user as iTokenData);
    if (!(requester.role.waiter || requester.role.production)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    const id = req.params.id as string;
    const dish = req.body as iDish;
    if (!verifyDishData(dish)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Invalid dish data."));
    }

    Dish.updateOne({ _id: mongoose.Types.ObjectId(id) }, dish).then((data) => {
        if (data.n === 0) {
            return next(cResponse.error(eHttpCode.NOT_FOUND, "Dish not found."));
        }
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /dishes/{id}:
 *   delete:
 *     tags: [Dishes]
 *     summary: Delete a Dish.
 *     description: Delete a Dish from the system by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the dish to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dish deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. You don't have permission to delete a dish.
 *       404:
 *         description: Not Found. The dish with the specified ID was not found.
 *       500:
 *         description: Internal Server Error. There was a database error.
 */
dishes.delete("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!(requester.role.cashier)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    const id = req.params.id as string;

    Dish.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
        if (data.n === 0) {
            return next(cResponse.error(eHttpCode.NOT_FOUND, "Dish not found."));
        }
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
            return next(cResponse.error(eHttpCode.NOT_FOUND, 'Dish not found'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

export default dishes;