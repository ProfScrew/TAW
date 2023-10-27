import { Router } from "express";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import { Dish, iDish, verifyDishData } from "../../../models/dish.model";



const dishes = Router();

/**
 * @swagger
 * tags:
 *  name: Dishes
 * description: Dishes management
 */

dishes.get("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter || requester.role.production || requester.role.cashier)){
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }
    const id = req.query.id as string;

    let query : any = id ? {_id: id} : {};

    Dish.find(query).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }
    ).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

dishes.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter || requester.role.production || requester.role.cashier)){
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }

    const dishData = req.body as iDish;
    if(!verifyDishData(dishData)){
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Invalid dish data."));
    }
    const dish = new Dish(dishData);
    dish.save().then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        if(err.code === 11000){
            return next(cResponse.error(eHttpCode.BAD_REQUEST, "Dish already exists."));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

dishes.put("/", authorize,  async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter || requester.role.production || requester.role.cashier)){
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }

    return next(cResponse.error(eHttpCode.OK, "Not implemented"));

});

dishes.delete("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter || requester.role.production || requester.role.cashier)){
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You don't have permission to access dishes."));
    }


    return next(cResponse.error(eHttpCode.OK, "Not implemented"));
});

export default dishes;