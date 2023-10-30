import { Router } from "express";
import { Category, iCategory, verifyCategoryData } from "../../../models/category.model";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import mongoose from "mongoose";

const categories = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categories management
 */


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get categories list and, if id or name is provided, get category by id or name
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the category to get.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the category to get.
 *     responses:
 *       200:
 *         description: Categories list
 *       500:
 *         description: Internal server error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
categories.get("/", authorize, async (req, res, next) => {
    const id = req.query.id as string;
    const name = req.query.name as string;

    const query : any = id ? { _id: id } : name? { name: name } : {};

    Category.find(query).then((data) => {
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new Category.
 *     description: Create a new Category in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Category data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category created successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: Data not valid.
 */
categories.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    const categoryData = req.body as iCategory;

    if(!verifyCategoryData(categoryData)) {
        return next(cResponse.genericMessage(eHttpCode.BAD_REQUEST, "Invalid form data"));
    }

    const category=new Category(categoryData);

    category.save().then((data) => {
        return next(cResponse.success(eHttpCode.CREATED, { id: data._id }));
    }).catch((reason: { code: number, errmsg: string }) => {
        if (reason.code === 11000) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Category already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
    }); 
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update a category by id.
 *     description: Update a category by id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the category to update.
 *     requestBody:
 *       description: Category data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: An error occurred while updating the category.
 */
categories.put("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id as string;
    if(!requester.role.admin){
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const category = req.body as iCategory;
    if(!verifyCategoryData(category)){
        return next(cResponse.genericMessage(eHttpCode.BAD_REQUEST, "Category data is not valid"));
    }

    Category.updateOne({_id: mongoose.Types.ObjectId(id)}, category).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.genericMessage(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category by id.
 *     description: Delete a category by id.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the category to delete.
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: An error occurred while deleting the Category in DB.
 */
categories.delete("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id;

    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    if (id === undefined || typeof id !== 'string') {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Bad request'));
    }


    Category.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }
    ).catch((err) => {
        if(err.name === 'DocumentNotFoundError'){
            return next(cResponse.error(eHttpCode.NOT_FOUND, 'Category not found'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});





export default categories;