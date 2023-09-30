import { Router } from "express";
import { iIngredient, Ingredient, isIngredient} from "../../../base/ingredient";
import { iUserAction, UserAction } from "../../../common/typedef";
import { timestamp } from "../../../common/util";
import { authorize, iTokenData } from "../../../common/authentication";
import mongoose from "mongoose";
import { get } from "http";
import {http_response} from "../../../common/util"; //<--- *************implement this later ************ 
import { next_middleware } from "../../../common/util";

const ingredients = Router();

/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Ingredient management
 */

function asIngredient(data: unknown): iIngredient{
    if (typeof data !== 'object') throw new Error("Invalid data type");
    if (data === null) throw new Error("Data is null");
    return data as iIngredient;
}

/**
 * @swagger
 * /ingredients/:
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
 *     responses:
 *       200:
 *         description: Successful response with the list of ingredients or a single ingredient.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
ingredients.get("/", authorize, (req, res, next)=>{
    const role = (req.user as iTokenData).role!;
    const id = req.query.id as string;
    const name = req.query.name as string;

    if (!role.canReadIngredients) return next({ statusCode: 403, error: true, errormessage: 'Forbidden' });
    
    let query: any = {};
    if (id){
        query = { _id: id };
    }
    else if (name){
        query = { name: name };
    }
    else{
        query = {};
    }

    Ingredient.find(query, (error, ingredient) => {
        if (error) {
            next_middleware({ status: 500, error: true, message: 'An error occurred while fetching ingredients' }, next);
        } else {
            next_middleware({ status: 200, error: false, payload: ingredient }, next);
        }
    });
    
});

/**
 * @swagger
 * /ingredients/:
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
 *         description: Bad request - The request body was not valid.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
ingredients.post("/",authorize, async (req, res, next) =>{
    const role = (req.user as iTokenData).role!;
    if (!role.canCreateIngredients) {return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);}

    const ingredientData = req.body as iIngredient;
    const ingredient = new Ingredient(ingredientData);
    ingredient.save().then((data) => {
        return next_middleware({ status: 200, error: false, payload: { id: data._id } }, next);
    }).catch((reason: {code: number, errmsg: string}) => {
        return next_middleware({ status: 500, error: true, message: 'DB error: ' + reason.errmsg }, next);
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
 *         description: Bad request - The request body was not valid.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
ingredients.put('/:id',authorize, async (req, res, next)=> {//Todo: modify in order to include changes to the current recipes
    const role = (req.user as iTokenData).role!;
    if (!role.canEditIngredients) {return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);}
    
    let ingredientIdObjectId: mongoose.Types.ObjectId;
    try{ ingredientIdObjectId = mongoose.Types.ObjectId(req.params.id);}
    catch{return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);}

    const ingredient = req.body as Partial<iIngredient>;
    const userAction : iUserAction = {
        actor: {
            username: (req.user as iTokenData).username!,
            name: (req.user as iTokenData).name!
        },
        timestamp: new Date()
    };
    
    const existingIngredient = await Ingredient.findById(ingredientIdObjectId);
    await existingIngredient?.updateArchive(ingredient, userAction).catch((error) => {
        return next_middleware({ status: 500, error: true, message: 'DB error: ' + error }, next);
        
    });
    return next_middleware({ status: 200, error: false, payload: { message: 'Ingredient updated' } }, next);
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
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Ingredient not found.
 *       500:
 *         description: An error occurred while deleting the Ingredient in DB.
 */
ingredients.delete("/:id",authorize, async (req, res, next)=>{
    const role = (req.user as iTokenData).role!;
    if (!role.canDeleteIngredients) {return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);}

    const userAction : iUserAction = {
        actor: {
            username: (req.user as iTokenData).username!,
            name: (req.user as iTokenData).name!
        },
        timestamp: new Date()
    };
    let deletedIngredient: iIngredient | null;
    try{ deletedIngredient = await Ingredient.findById(req.params.id);}
    catch{return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);}

    if(!deletedIngredient){return next_middleware({ status: 404, error: true, message: 'Ingredient Not Found.' }, next);}

    deletedIngredient.deleteArchive(userAction).catch((error) => {
        return next_middleware({ status: 500, error: true, message: 'DB error: ' + error }, next);
    });
    return next_middleware({ status: 200, error: false, payload: { message: 'Ingredient deleted' } }, next);
});


export default ingredients;