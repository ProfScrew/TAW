import { Router } from "express";

import { iUserAction, UserAction } from "../../../models/user_action.object";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import mongoose, { isValidObjectId } from "mongoose";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import { iCourseArchive, iDishArchive, iDishModificationArchive, iOrderArchive, OrderArchive } from "../../../models/order_archive.model";
import { Order } from "../../../models/order.model";
import { Dish, eDishModificationType } from "../../../models/dish.model";
import { Ingredient } from "../../../models/ingredient.model";
import { Table } from "../../../models/table.model";
import { RestaurantInformation } from "../../../models/restaurant_information.model";

const order_archives = Router();



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

/*
order_archives.post("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!(requester.role.analytics || requester.role.cashier)) {
        return next(cResponse.error(eHttpCode.FORBIDDEN, "You are not allowed to access this resource"));
    }
    const id = req.params.id as string;
    if (isValidObjectId(id) === false) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid order ID'));
    }

    let newOrder: Partial<iOrderArchive> = {};

    Order.findById(mongoose.Types.ObjectId(id)).then(async (order) => {
        //find room name and tables
        let tablesName: string[] = [];
        await order?.tables.forEach(async (table) => {
            await Table.findById(table).then((table) => {
                tablesName.push(table?.name!);
            }).catch((err) => {
                return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
            });
        });

        let chargesPersonToArchive: number = 0;
        await RestaurantInformation.findOne().then((restaurantInformation) => {
            chargesPersonToArchive = restaurantInformation?.charge_per_person!;
        }
        ).catch((err) => {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
        });
        chargesPersonToArchive = chargesPersonToArchive * order!.guests;
        

        //find courses dishes
        let coursesToArchive: iCourseArchive[] = [];
        
        await order?.courses.forEach(async (course, courseIndex) => {
            let dishesToArchive: iDishArchive[] = [];

            await Dish.findById(course.dishes).then(async (dish) => {
                //check if dish is not empty
                if (!dish) {
                    return next(cResponse.error(eHttpCode.NOT_FOUND, "Dish not found"));
                }

                let dishModificationToArchive: iDishModificationArchive[] = [];
                
                
                await dish?.modifications?.forEach(async (modification) => {
                    //find modification, calculate price and push to dishModificationToArchive
                    let dishModificationPrice: number = 0;
                    await Ingredient.findById(modification.ingredient).then((ingredient) => {
                        ingredient?.modification_price
                        ingredient?.modification_percentage
                        if (modification.type == eDishModificationType.add || modification.type == eDishModificationType.remove) {
                            dishModificationPrice = (modification.type == eDishModificationType.add) ? ingredient?.modification_price! : -ingredient?.modification_price!;
                        }else{
                            dishModificationPrice = (modification.type == eDishModificationType.more) ? 
                            (ingredient?.modification_price! * ingredient?.modification_percentage! / 100) : 
                            (-ingredient?.modification_price! * ingredient?.modification_percentage! / 100);
                        }
                    }).catch((err) => {
                        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
                    });
                    
                    dishModificationToArchive.push({
                        ingredient: modification.ingredient,
                        type: modification.type,
                        price: dishModificationPrice,
                    });
                    console.log("dish modification to archive \n" +dishModificationToArchive[0]);
                });

                dishesToArchive.push({
                    recipe: dish?.recipe!,
                    actual_price: dish?.actual_price!,
                    notes: dish?.notes,
                    logs_status: dish?.logs_status,
                    modifications: dishModificationToArchive,
                });
                console.log("dishes to archive \n" +dishesToArchive[0].recipe);
                
            }).catch((err) => {
                return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
            });

            coursesToArchive.push({
                logs_course: {
                    created_course: course?.logs_course?.created_course!,
                    served_course: course?.logs_course?.served_course!,
                    deleted_course: course?.logs_course?.deleted_course!,
                },
                dishes: dishesToArchive,
            });
            console.log("courses to archive \n" +coursesToArchive[0]);
        });
        console.log("!!!!! dishes to archive \n" +coursesToArchive[0].dishes[0].recipe);
        newOrder = {
            guests: order?.guests!,
            capacity: order?.capacity!,
            logs_order: {
                created_order: order?.logs_order?.created_order!,
            },
            final_price: order?.final_price!,
            courses: coursesToArchive,
            tables: tablesName,
            charges_persons: chargesPersonToArchive,
        };
        console.log(newOrder);
        return next(cResponse.success(eHttpCode.OK, newOrder));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });

    console.log(newOrder);
    
    


    
    /*
    
    const order_archive = new OrderArchive(req.body);
    order_archive.save().then((order_archive) => {
        return next(cResponse.success(eHttpCode.CREATED, order_archive));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });
    
});
*/
//---------------start temp code -------------------------------------
order_archives.post("/:id", authorize, async (req, res, next) => {
    try {
        const requester = req.user as iTokenData;
        if (!(requester.role.analytics || requester.role.cashier)) {
            return next(cResponse.error(eHttpCode.FORBIDDEN, "You are not allowed to access this resource"));
        }

        const id = req.params.id as string;
        if (!isValidObjectId(id)) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid order ID'));
        }

        const order = await Order.findById(mongoose.Types.ObjectId(id));
        if (!order) {
            return next(cResponse.error(eHttpCode.NOT_FOUND, 'Order not found'));
        }

        const tablesName = await findTableNames(order.tables);
        const chargesPersonToArchive = await findChargesPerPerson(order);

        const coursesToArchive = await findCourseArchives(order.courses);

        const newOrder = {
            guests: order.guests,
            capacity: order.capacity,
            logs_order: {
                created_order: order.logs_order.created_order,
            },
            final_price: order.final_price,
            courses: coursesToArchive,
            tables: tablesName,
            charges_persons: chargesPersonToArchive,
        };

        return next(cResponse.success(eHttpCode.OK, newOrder));
    } catch (err) {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    }
});

async function findTableNames(tableIds) {
    const tablesName = [];
    for (const table of tableIds) {
        const foundTable = await Table.findById(table);
        if (foundTable) {
            tablesName.push(foundTable.name);
        }
    }
    return tablesName;
}

async function findChargesPerPerson(order) {
    const restaurantInformation = await RestaurantInformation.findOne();
    return restaurantInformation.charge_per_person * order.guests;
}

async function findCourseArchives(courses) {
    const coursesToArchive = [];
    for (const course of courses) {
        const dishesToArchive = await findDishArchives(course.dishes);
        coursesToArchive.push({
            logs_course: {
                created_course: course.logs_course.created_course,
                served_course: course.logs_course.served_course,
                deleted_course: course.logs_course.deleted_course,
            },
            dishes: dishesToArchive,
        });
    }
    return coursesToArchive;
}

async function findDishArchives(dishIds) {
    const dishesToArchive = [];
    for (const dishId of dishIds) {
        const dish = await Dish.findById(dishId);
        if (!dish) {
            throw new Error('Dish not found');
        }

        const dishModificationToArchive = await findDishModifications(dish.modifications);
        dishesToArchive.push({
            recipe: dish.recipe,
            actual_price: dish.actual_price,
            notes: dish.notes,
            logs_status: dish.logs_status,
            modifications: dishModificationToArchive,
        });
    }
    return dishesToArchive;
}

async function findDishModifications(modifications) {
    const dishModificationToArchive = [];
    for (const modification of modifications) {
        const ingredient = await Ingredient.findById(modification.ingredient);
        if (ingredient) {
            let dishModificationPrice = 0;
            if (modification.type === eDishModificationType.add || modification.type === eDishModificationType.remove) {
                dishModificationPrice = modification.type === eDishModificationType.add ? ingredient.modification_price : -ingredient.modification_price;
            } else {
                dishModificationPrice = modification.type === eDishModificationType.more ?
                    (ingredient.modification_price * ingredient.modification_percentage / 100) :
                    (-ingredient.modification_price * ingredient.modification_percentage / 100);
            }
            dishModificationToArchive.push({
                ingredient: modification.ingredient,
                type: modification.type,
                price: dishModificationPrice,
            });
        }
    }
    return dishModificationToArchive;
}
//---------------start temp code -------------------------------------

order_archives.put("/:id", authorize, async (req, res, next) => {

});

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
        return next(cResponse.success(eHttpCode.OK, order_archive));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, err));
    });

});

export default order_archives;