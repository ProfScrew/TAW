import { Router , Request , Response, NextFunction } from "express";
import swaggerUi from 'swagger-ui-express';

import user  from "./routes/user";
import role  from "./routes/role";
import table from "./routes/table";
import order from "./routes/order";
import physical_table from "./routes/physical_table";
import ingredient from "./routes/ingredient";
import swaggerSpec from "./swagger_config";
import * as colors from 'colors'
import { HttpResponse } from "../../common/util";

const v1 = Router();
colors.enable();

v1.use('/users',  user);
v1.use('/roles',  role)
v1.use('/tables', table);
v1.use('/ingredients', ingredient);
v1.use('/orders', order);
v1.use('/physical_tables', physical_table);

// Swagger page
v1.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Docs in JSON format
v1.get("/docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

v1.get('/', (req: Request, res: Response) => {
  console.log('Redirecting to /v1/docs'.green);
  
  res.redirect('/v1/docs');
});



v1.use((result: HttpResponse, __: Request, res: Response, ____: NextFunction) => {
  if (result.status === undefined) {
    console.error(result);
    return res.status(500).json({ status: 500, error: true, message: 'Internal server error' });
  }

  return res.status(result.status).json(result);
});

export default v1;
