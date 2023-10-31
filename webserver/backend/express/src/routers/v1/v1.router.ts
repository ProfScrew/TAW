import { Router, Request, Response, NextFunction } from "express";
import swaggerUi from 'swagger-ui-express';

import user from "./routes/user.route";

import tables from "./routes/table.route";
import ingredients from "./routes/ingredient.route";
import swaggerSpec from "../swagger/swagger.config";
import * as colors from 'colors'
import { responseHandler } from "../../middlewares/response.middleware";
import categories from "./routes/category.route";
import rooms from "./routes/room.route";
import recipes from "./routes/recipe.route";
import restaurant_information from "./routes/restaurant_information.route";
import orders from "./routes/order.route";
import dishes from "./routes/dish.route";

const v1 = Router();
colors.enable();

// Routes 🧭
v1.use('/users', user);
v1.use('/ingredients', ingredients);
v1.use('/categories', categories);
v1.use('/rooms', rooms);
v1.use('/recipes', recipes);
v1.use('/orders', orders);
v1.use('/tables', tables);
v1.use('/restaurant_informations', restaurant_information);
v1.use('/dishes', dishes);

//Swagger Docs 📚
v1.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger Docs in JSON format 📜
v1.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

v1.get('/', (req: Request, res: Response) => {
    console.log('Redirecting to /v1/docs'.green);

    res.redirect('/v1/docs');
});



v1.use(responseHandler);

export default v1;
