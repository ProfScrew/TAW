import {Router} from 'express';
import { authorize, iTokenData } from '../../../middlewares/auth.middleware';
import { Recipe, iRecipe, verifyRecipeData } from '../../../models/recipe.model';
import { cResponse, eHttpCode } from '../../../middlewares/response.middleware';
import mongoose from 'mongoose';

const recipes = Router();
/**
 * @swagger
 * tags:
 *  name: Recipes
 * description: Recipe management
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get recipes
 *     description: Retrieve a list of recipes or a single recipe by ID or name.
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the recipe to get. If not provided, it returns a list of all recipes.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the recipe to get. If not provided, it returns a list of all recipes.
 *     responses:
 *       200:
 *         description: Successful response with the list of recipes or a single recipe.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
recipes.get('/', authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.query.id as string;
    const name = req.query.name as string;

    const query : any = id ? {_id: id} : name? {name: name} : {};

    Recipe.find(query).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: Create a new recipe if the user has the necessary permissions.
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'  # Reference to the Recipe schema definition
 *     responses:
 *       200:
 *         description: Recipe created successfully.
 *       400:
 *         description: Bad request - Invalid recipe data or recipe already exists.
 *       401:
 *         description: Unauthorized - User does not have the necessary permissions.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
recipes.post('/', authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!requester.role.admin){
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const recipe = req.body as iRecipe;
    if(!verifyRecipeData(recipe)){
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Recipe data is not valid'));
    }

    const newRecipe = new Recipe(recipe);
    newRecipe._id = new mongoose.Types.ObjectId();

    newRecipe.save().then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        if(err.code === 11000){
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Recipe already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });

});

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Update a recipe by ID
 *     description: Update an existing recipe in the system by providing its ID.
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the recipe to update.
 *         required: true
 *     requestBody:
 *       description: Updated recipe data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recipe successfully updated.
 *       400:
 *         description: Bad Request - The provided recipe data is not valid.
 *       401:
 *         description: Unauthorized - User is not authorized to update a recipe.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
recipes.put('/:id', authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id as string;
    if(!requester.role.admin){
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const recipe = req.body as iRecipe;
    if(!verifyRecipeData(recipe)){
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Recipe data is not valid'));
    }
    Recipe.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, recipe, {upsert: true}).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        if(err.code === 11000){
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Recipe already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /recipes:
 *   delete:
 *     summary: Delete a recipe
 *     description: Delete a recipe by its ID if the user has the necessary permissions.
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to delete.
 *     responses:
 *       200:
 *         description: Recipe deleted successfully.
 *       401:
 *         description: Unauthorized - User does not have the necessary permissions.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
recipes.delete('/', authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!requester.role.admin){
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const id = req.query.id as string;

    Recipe.deleteOne({_id: mongoose.Types.ObjectId(id)}).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});


export default recipes;