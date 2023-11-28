import { Router } from "express";
import { RestaurantInformation, iRestaurantInformation, verifyResturantInformationData } from "../../../models/restaurant_information.model";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import mongoose, { isValidObjectId } from "mongoose";
import { Redis } from "../../../services/redis.service";
import { io } from '../../../app';
import { eListenChannels } from "../../../models/channels.enum";

const resturant_informations = Router();

/**
 * @swagger
 * tags:
 *   name: Restaurant Informations
 *   description: Restaurant informations management
 */


/**
 * @swagger
 * /restaurant_informations:
 *   get:
 *     tags:
 *       - Restaurant Informations
 *     summary: Retrieve restaurant informations
 *     description: Retrieve restaurant informations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the resturant information to retrieve.
 *     responses:
 *       200:
 *         description: A list of physical tables.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: An error occurred while fetching physical tables.
 */
resturant_informations.get("/", authorize, async (req, res, next) => {
    const id = req.query.id as string;

    const query: any = id ? { _id: id } : {};

    if (id && !isValidObjectId(id)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid id'));
    }
    const cachedData = await Redis.get<iRestaurantInformation[]>("RestaurantInformation:" + JSON.stringify(query), true);
    if (cachedData !== null) {
        return next(cResponse.genericMessage(eHttpCode.OK, cachedData));
    }

    RestaurantInformation.find(query).then((data) => {
        Redis.set<iRestaurantInformation[]>("RestaurantInformation:" + JSON.stringify(query), data);
        return next(cResponse.genericMessage(eHttpCode.OK, data));
        
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /restaurant_informations:
 *   post:
 *     tags:
 *       - Restaurant Informations
 *     summary: Create restaurant information
 *     description: Create restaurant information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Restaurant information object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantInformation'
 *     responses:
 *       200:
 *         description: Restaurant information created successfully
 *       400:
 *         description: Restaurant information creation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: An error occurred while creating restaurant information
 */
resturant_informations.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    const restaurant_information = req.body as iRestaurantInformation;

    if (!verifyResturantInformationData(restaurant_information)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Invalid form data"));
    }

    RestaurantInformation.find({}).then((data) => {
        if (data.length > 0) {
            return next(cResponse.error(eHttpCode.CONFLICT,'Information of the Restaurant already exists'));
        }
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
  

    const resturantInformation = new RestaurantInformation(restaurant_information);

    resturantInformation.save().then((data) => {
        Redis.delete("RestaurantInformation:" + JSON.stringify({}));
        io.to('admin').emit(eListenChannels.restaurantInformation, { message: 'Restaurant Information list updated!' });
        return next(cResponse.genericMessage(eHttpCode.CREATED, { id: data._id }));
    }).catch((reason: { code: number, errmsg: string }) => {
        if (reason.code === 11000) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'ResturantInformation already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
    });
});

/**
 * @swagger
 * /restaurant_informations/{id}:
 *   put:
 *     tags:
 *       - Restaurant Informations
 *     summary: Update restaurant information
 *     description: Update restaurant information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Restaurant information id
 *     requestBody:
 *       description: Restaurant information object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantInformation'
 *     responses:
 *       200:
 *         description: Restaurant information updated successfully
 *       400:
 *         description: Restaurant information update failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: An error occurred while updating restaurant information
 */
resturant_informations.put("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id as string;

    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const restaurant_information = req.body as iRestaurantInformation;
    if (!verifyResturantInformationData(restaurant_information)) {
        return next(cResponse.genericMessage(eHttpCode.BAD_REQUEST, "RestaurantInformation data is not valid"));
    }

    RestaurantInformation.updateOne({ _id: mongoose.Types.ObjectId(id) }, restaurant_information).then((data) => {
        Redis.delete("RestaurantInformation:" + JSON.stringify({}));
        Redis.delete("RestaurantInformation:" + JSON.stringify({ _id: id }));
        io.to('admin').emit(eListenChannels.restaurantInformation, { message: 'Restaurant Information list updated!' });
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.genericMessage(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});


export default resturant_informations;