import { Router , Request , Response, NextFunction } from "express";
import swaggerUi from 'swagger-ui-express';

import user  from "./routes/user.route";
import table from "./routes/virtual_table.route";
import order from "./routes/order.route";
import physical_table from "./routes/physical_table.route";
import ingredient from "./routes/ingredient.route";
import swaggerSpec from "../swagger/swagger.config";
import * as colors from 'colors'
import { HttpResponse } from "../../middlewares/http.middleware";

const v1 = Router();
colors.enable();

v1.use('/users',  user);
//v1.use('/tables', table);
//v1.use('/ingredients', ingredient);
//v1.use('/orders', order);
//v1.use('/physical_tables', physical_table);
 
// Swagger Docs 📚
//v1.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//// Swagger Docs in JSON format
//v1.get("/docs.json", (req: Request, res: Response) => {
//  res.setHeader("Content-Type", "application/json");
//  res.send(swaggerSpec);
//});
//
//v1.get('/', (req: Request, res: Response) => {
//  console.log('Redirecting to /v1/docs'.green);
//  
//  res.redirect('/v1/docs');
//});
//


v1.use((result: HttpResponse, __: Request, res: Response, ____: NextFunction) => {
  if (result.status === undefined) {
    console.error(result);
    return res.status(500).json({ status: 500, error: true, message: 'Internal server error' });
  }

  return res.status(result.status).json(result);
});

export default v1;
