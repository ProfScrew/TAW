import { Router } from "express";
import { iDish, Dish } from "../../../models/dish"; 
import { Order, iCourse } from "../../../models/order";

import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { iUser } from "../../../models/user";
import { http_response, http_next, next_middleware } from "../../../middlewares/http.middleware";

import mongoose from "mongoose";


const dishes = Router();

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: Dishes management
 */

dishes.get("/:id", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    const id   = req.params.id;

    if (!role.canReadDishes) return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);
    if (id === null)         return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);

    Dish.findOne({id: id}).orFail().exec((err, dish) => {
        if (err) return next_middleware({ status: 404, error: true, message: err.message }, next);
        res.json(dish);
    });

});
//get all dishes
dishes.get("/", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    
    if (!role.canReadDishes) return http_next({ status: 403, error: true, message: 'Forbidden' }, next);

    Dish.find().orFail().exec((err,dishes) => {
        if (err) return http_response({ status: 404, error: true, message: err.message }, res);
        res.json(dishes);
    });
});
//create a dish
dishes.put("/", authorize, (req,res,next) => {
    // TODO: Assign the right production node
});
//delete a dish
dishes.delete("/:id", authorize, (req,res,next) => {
    try{
        const role = (req.user as iTokenData).role!;
        const id = req.params.id;

        if (!role.canDeleteDishes) {
            return http_next({ status: 403, error: true, message: 'Forbidden' }, next);
        }



    } catch (error) {
        next(error); 
    }
});

dishes.patch("/:id/status", authorize, (req,res,next) => {});

dishes.put("/:id/modification", authorize, (req,res,next) => {});
dishes.delete("/:id/modification", authorize, (req,res,next) => {});



export default dishes;