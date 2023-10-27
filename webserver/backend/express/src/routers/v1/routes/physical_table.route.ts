import { Router } from "express";
import { iPhysicalTable, PhysicalTable,verifyPhisicalTableData } from "../../../models/physical_table.model";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import mongoose from "mongoose";

const physical_tables = Router();

/**
 * @swagger
 * tags:
 *   name: Physical Tables
 *   description: Physical Table management
 */

/**
 * @swagger
 * /physical_tables:
 *   get:
 *     tags:
 *       - Physical Tables
 *     summary: Retrieve a list of physical tables.
 *     description: Retrieve a list of physical tables that are registered in the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the physical table to retrieve.
 *     responses:
 *       200:
 *         description: A list of physical tables.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: An error occurred while fetching physical tables.
 */
physical_tables.get("/", authorize, (req, res, next) => {
    const id = req.query.id as string;

    const query : any = id ? { _id: id } : {};

    PhysicalTable.find(query).then((data) => {
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /physical_tables:
 *   post:
 *     tags:
 *       - Physical Tables
 *     summary: Create a new physical table.
 *     description: Create a new physical table.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhysicalTable'
 *     responses:
 *       200:
 *         description: A physical table was created.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: An error occurred while creating the physical table.
 */
physical_tables.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    const physicalTablesData = req.body as iPhysicalTable;

    if(!verifyPhisicalTableData(physicalTablesData)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Invalid form data"));
    }

    const physicalTable=new PhysicalTable(physicalTablesData);

    physicalTable.save().then((data) => {
        // function that creates virtual tables
        return next(cResponse.success(eHttpCode.CREATED, { id: data._id }));
    }).catch((reason: { code: number, errmsg: string }) => {
        if (reason.code === 11000) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, 'PhysicalTable already exists'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
    }); 
});

/**
 * @swagger
 * /physical_tables/{id}:
 *   put:
 *     tags: [Physical Tables]
 *     summary: Update a physical table by id.
 *     description: Update a physical table by id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the physical table to update.
 *     requestBody:
 *       description: The physical table data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhysicalTable'
 *     responses:
 *       200:
 *         description: Physical table updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: An error occurred while updating the physical table.
 */
physical_tables.put("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id as string;

    if(!requester.role.admin){
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const physical_table = req.body as iPhysicalTable;
    if(!verifyPhisicalTableData(physical_table)){
        return next(cResponse.genericMessage(eHttpCode.BAD_REQUEST, "Category data is not valid"));
    }

    PhysicalTable.updateOne({_id: mongoose.Types.ObjectId(id)}, physical_table).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.genericMessage(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /physical_tables/{id}:
 *   delete:
 *     tags: [Physical Tables]
 *     summary: Delete a PhysicalTable by id.
 *     description: Delete a PhysicalTable by id.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the PhysicalTable to delete.
 *     responses:
 *       200:
 *         description: PhysicalTable deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: PhysicalTables not found.
 *       500:
 *         description: An error occurred while deleting the PhysicalTable in DB.
 */
physical_tables.delete("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id;

    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    if (id === undefined || typeof id !== 'string') {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Bad request'));
    }


    PhysicalTable.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
        return next(cResponse.success(eHttpCode.OK, data));
    }
    ).catch((err) => {
        if(err.name === 'DocumentNotFoundError'){
            return next(cResponse.error(eHttpCode.NOT_FOUND, 'PhysicalTable not found'));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});



export default physical_tables; 