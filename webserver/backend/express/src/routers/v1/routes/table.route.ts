import { Router } from "express";
import { eTableStatus, iTable, Table,verifyTableData } from "../../../models/table.model";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import mongoose from "mongoose";
import { io } from '../../../app';
import { eListenChannels } from "../../../models/channels.enum";

const  tables = Router();

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Table management
 */

/**
 * @swagger
 * /tables:
 *   get:
 *     tags:
 *       - Tables
 *     summary: Retrieve a list of tables.
 *     description: Retrieve a list of tables that are registered in the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the table to retrieve.
 *     responses:
 *       200:
 *         description: A list of tables.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: An error occurred while fetching tables.
 */
 tables.get("/", authorize, (req, res, next) => {
    const id = req.query.id as string;

    const query : any = id ? { _id: id } : {};

    Table.find(query).then((data) => {
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /tables:
 *   post:
 *     tags:
 *       - Tables
 *     summary: Create a new table.
 *     description: Create a new table.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: A table was created.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: An error occurred while creating the table.
 */
 tables.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    const TablesData = req.body as iTable;

    if(!verifyTableData(TablesData)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Invalid form data"));
    }

    const table=new Table(TablesData);

    table.save().then((data) => {
        // function that creates virtual tables
        io.emit(eListenChannels.tables, { message: 'Table list updated!' });
        return next(cResponse.genericMessage(eHttpCode.CREATED, { id: data._id }));
    }).catch((reason: { code: number, errmsg: string }) => {
        if (reason.code === 11000) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Table already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
    }); 
});

/**
 * @swagger
 * /tables/{id}/status/{type}:
 *   put:
 *     tags: [Tables]
 *     summary: Update status of a table by id.
 *     description: Update status of a table by id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the table to update.
 *       - in: path
 *         name: type
 *         required: true
 *         description: The status of table to update.
 *         schema:
 *           type: string
 *           enum:
 *             - free
 *             - busy
 *     responses:
 *       200:
 *         description: Table updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: An error occurred while updating the table.
 */
tables.put("/:id/status/:type", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if(!(requester.role.waiter || requester.role.cashier)){
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const id = req.params.id as string;
    const type = req.params.type as eTableStatus;

    if(!Object.values(eTableStatus).includes(type)){
        return next(cResponse.genericMessage(eHttpCode.BAD_REQUEST, "Invalid table status"));
    }

    Table.updateOne({_id: mongoose.Types.ObjectId(id)}, {status: type}).then((data) => {
        io.emit(eListenChannels.tables, { message: 'Table list updated!' });
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.genericMessage(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /tables/{id}:
 *   put:
 *     tags: [Tables]
 *     summary: Update a table by id.
 *     description: Update a table by id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the table to update.
 *     requestBody:
 *       description: The table data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: Table updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: An error occurred while updating the table.
 */
tables.put("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id as string;

    if(!requester.role.admin){
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const  table = req.body as iTable;
    if(!verifyTableData( table)){
        return next(cResponse.genericMessage(eHttpCode.BAD_REQUEST, "Category data is not valid"));
    }

    Table.updateOne({_id: mongoose.Types.ObjectId(id)},  table).then((data) => {
        io.emit(eListenChannels.tables, { message: 'Table list updated!' });
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.genericMessage(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /tables/{id}:
 *   delete:
 *     tags: [Tables]
 *     summary: Delete a Table by id.
 *     description: Delete a Table by id.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the Table to delete.
 *     responses:
 *       200:
 *         description: Table deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Tables not found.
 *       500:
 *         description: An error occurred while deleting the Table in DB.
 */
 tables.delete("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id;

    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    if (id === undefined || typeof id !== 'string') {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Bad request'));
    }


    Table.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
        io.emit(eListenChannels.tables, { message: 'Table list updated!' });
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }
    ).catch((err) => {
        if(err.name === 'DocumentNotFoundError'){
            return next(cResponse.error(eHttpCode.NOT_FOUND, 'Table not found'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});



export default tables; 