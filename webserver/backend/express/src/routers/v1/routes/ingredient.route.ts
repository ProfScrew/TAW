import { Router } from "express";
import { iIngredient, Ingredient, verifyIngredientData } from "../../../models/ingredient.model";
import { iUserAction } from "../../../models/user_action.object";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import mongoose, { isValidObjectId, Schema } from "mongoose";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import { Redis } from "../../../services/redis.service";
import { io } from '../../../app';
import { eListenChannels } from "../../../models/channels.enum";
import { Order } from "../../../models/order.model";
import { Recipe } from "../../../models/recipe.model";

const ingredients = Router();

/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Ingredient management
 */

/**
 * @swagger
 * /ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Get an ingredient by name or get a list of ingredients if no name is provided.
 *     description: |
 *       Retrieve an ingredient by name or get a list of all ingredients if no name is provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the ingredient to get.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the ingredient to get.
 *       - in: query
 *         name: archive
 *         schema:
 *           type: string
 *         description: Search Inside archive or not.
 *     responses:
 *       200:
 *         description: Successful response with the list of ingredients or a single ingredient.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */

ingredients.get("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.query.id as string;
    const name = req.query.name as string;
    const archive = req.query.archive as string;



    let query: any = id ? { _id: id } : name ? { name: name } : {};

    if (archive === 'true') {
        query = { ...query, deleted: { $exists: true } };
    } else if (archive === 'false') {
        query = { ...query, deleted: { $exists: false } };
    }

    if (id && !isValidObjectId(id)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid id'));
    }
    if (!name) {
        const cachedData = await Redis.get<iIngredient[]>("Ingredient:" + JSON.stringify(query), true);
        if (cachedData !== null) {
            return next(cResponse.genericMessage(eHttpCode.OK, cachedData));
        }
    }

    Ingredient.find(query).then((data) => {
        Redis.set<iIngredient[]>("Ingredient:" + JSON.stringify(query), data);
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((error) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + error));
    });
});

/**
 * @swagger
 * /ingredients:
 *   post:
 *     tags:
 *       - Ingredients
 *     summary: Create a new ingredient.
 *     description: |
 *       Create a new ingredient.
 *       The request body should contain a JSON object with the following properties:
 *       - name: string
 *       - alergens: string[]
 *       - price_per_unit: number
 *       - unit: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ingredient'
 *     responses:
 *       200:
 *         description: Successful response with the id of the created ingredient.
 *       400:
 *         description: Bad request - Data not valid or Ingredient already exists.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
ingredients.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }


    const ingredientData = req.body as iIngredient;
    if (!verifyIngredientData(ingredientData)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Data not valid'));
    }
    const ingredient = new Ingredient(ingredientData);

    ingredient.save().then((data) => {
        Redis.delete("Ingredient:" + JSON.stringify({}));
        Redis.delete("Ingredient:" + JSON.stringify({ deleted: { $exists: false } }));
        io.emit(eListenChannels.ingredients, { message: 'Ingredients list updated!' });
        return next(cResponse.genericMessage(eHttpCode.CREATED, { id: data._id }));
    }).catch((reason: { code: number, errmsg: string }) => {
        if (reason.code === 11000) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Ingredient already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
    });
});


/**
 * @swagger
 * /ingredients/{id}:
 *   put:
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the ingredient to update.
 *     summary: Update an ingredient.
 *     description: |
 *       Update an ingredient and shadow deletes the old version by adding an object "deleted" to the db entry.
 *       The request body should contain a JSON object with the following properties:
 *       - name: string
 *       - alergens: string[]
 *       - price_per_unit: number
 *       - unit: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ingredient'
 *     responses:
 *       200:
 *         description: Successful response if the ingredient was updated correctly.
 *       400:
 *         description: Bad request - Data not valid or Ingredient is archived or Ingredient is in use.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       404:
 *         description: Forbidden - Ingredient not found.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
ingredients.put('/:id', authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    const orderCount = await Order.countDocuments({});
    if (orderCount !== 0) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Cannot modify ingredient if there are orders'));
    }


    /*
    add check recipe
    if exist ingredient in recipe(valid, not deleted)
    return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Ingredient is in use'));
    */
    const ingredient_data = req.body as iIngredient;
    if (!verifyIngredientData(ingredient_data)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Data not valid'));
    }
    const id = req.params.id;
    const requesterAction: iUserAction = {
        actor: {
            username: requester.username!,
            name: requester.name!,
            surname: requester.surname!
        },
        timestamp: new Date(Date.now())
    };

    Recipe.findOne({ ingredients: mongoose.Types.ObjectId(id) }, (err: any, recipe: any) => {
        if (recipe) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Ingredient is in use'));
        }
        if (err) {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err));
        }
        Ingredient.findById(id).then((ingredient: iIngredient | null) => { //finding the ingredient
            if (!ingredient) {
                return next(cResponse.error(eHttpCode.NOT_FOUND, 'Ingredient not found'));
            }
            if (ingredient.deleted) {
                return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Ingredient is archived'));
            }
            Ingredient.updateOne({ _id: mongoose.Types.ObjectId(id) }, { deleted: requesterAction }) //deleting the ingredient (shadow)
                .then((data) => {
                    Redis.delete("Ingredient: " + JSON.stringify({ _id: id }));
                    Redis.delete("Ingredient:" + JSON.stringify({ _id: id, deleted: { $exists: true } }));
                    Redis.delete("Ingredient:" + JSON.stringify({ _id: id, deleted: { $exists: false } }));
                    const newIngredient = new Ingredient({
                        ...ingredient_data,
                        _id: new mongoose.Types.ObjectId(),
                    });

                    Ingredient.create(newIngredient).then((data) => { //creating the new ingredient with updated data
                        Redis.delete("Ingredient:" + JSON.stringify({}));
                        Redis.delete("Ingredient:" + JSON.stringify({ deleted: { $exists: true } }));
                        Redis.delete("Ingredient:" + JSON.stringify({ deleted: { $exists: false } }));
                        io.emit(eListenChannels.ingredients, { message: 'Ingredients list updated!' });
                        return next(cResponse.genericMessage(eHttpCode.OK, { id: data._id }));
                    }).catch((errCreate: mongoose.Error) => {
                        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + errCreate.message));
                    });
                }).catch((errCreate: mongoose.Error) => {
                    return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + errCreate.message));
                });
        })
            .catch((error) => {
                if (error.name === 'DocumentNotFoundError') {
                    return next(cResponse.error(eHttpCode.NOT_FOUND, 'Ingredient not found'));
                }
                return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + error));
            });

    });
});

/**
 * @swagger
 * /ingredients/{id}:
 *   delete:
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the ingredient to delete.
 *     summary: Delete an ingredient.
 *     description: |
 *       Delete an ingredient and shadow deletes the old version by adding an object "deleted" to the db entry.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ingredient deleted successfully.
 *       401:
 *         description: Ingredient in use or Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Ingredient not found.
 *       500:
 *         description: An error occurred while deleting the Ingredient in DB.
 */
ingredients.delete("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }
    const orderCount = await Order.countDocuments({});
    if (orderCount !== 0) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Cannot delete ingredient if there are orders'));
    }
    const id = req.params.id;
    /*
    add check recipe
    if exist ingredient in recipe(valid, not deleted)
    return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Ingredient is in use'));
    */

    const requesterAction: iUserAction = {
        actor: {
            username: requester.username!,
            name: requester.name!,
            surname: requester.surname!
        },
        timestamp: new Date(Date.now())
    };

    Recipe.findOne({ ingredients: mongoose.Types.ObjectId(id) }, (err: any, recipe: any) => {
        if (err) {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err));
        }
        if (recipe) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Ingredient is in use'));
        }

        Ingredient.updateOne({ _id: mongoose.Types.ObjectId(id) }, { deleted: requesterAction })
            .then((data) => {
                Redis.delete("Ingredient:" + JSON.stringify({}));
                Redis.delete("Ingredient:" + JSON.stringify({ deleted: { $exists: true } }));
                Redis.delete("Ingredient:" + JSON.stringify({ deleted: { $exists: false } }));
                Redis.delete("Ingredient:" + JSON.stringify({ _id: id }));
                Redis.delete("Ingredient:" + JSON.stringify({ _id: id, deleted: { $exists: true } }));
                Redis.delete("Ingredient:" + JSON.stringify({ _id: id, deleted: { $exists: false } }));
                io.emit(eListenChannels.ingredients, { message: 'Ingredients list updated!' });
                return next(cResponse.genericMessage(eHttpCode.OK, data));
            })
            .catch((error) => {
                if (error.name === 'DocumentNotFoundError') {
                    return next(cResponse.error(eHttpCode.NOT_FOUND, 'Ingredient not found'));
                }
                return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + error));
            });

    });

});

export default ingredients;