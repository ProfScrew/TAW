import {Router} from "express";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { iVirtualTable,VirtualTable } from "../../../models/virtual_table.model";
import mongoose from 'mongoose';
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";

const virtual_tables = Router();

/**
 * @swagger
 * tags:
 *   name: Virtual Tables
 *   description: Virtual Table management
 */

/**
 * @swagger
 * /virtual_tables:
 *   get:
 *     summary: Get a list of virtual tables or a single virtual table by ID.
 *     description: Get a list of virtual tables or a single virtual table by ID.
 *     tags:
 *       - Virtual Tables
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the virtual table to get. If not present, all virtual tables will be returned.
 *     responses:
 *       200:
 *         description: Successful response with the list of virtual tables or a single virtual table.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
virtual_tables.get('/', authorize, async (req, res, next) => {
    const id = req.query.id as string;

    const query : any = id ? { _id: id } : {};

    VirtualTable.find(query).then((data) => {
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});



virtual_tables.post("/", authorize, async (req, res, next) => {

});

virtual_tables.put('/:id', authorize, async (req, res, next) => {

}); 

virtual_tables.delete('/:id', authorize, async (req, res, next) => {

});

export default virtual_tables;