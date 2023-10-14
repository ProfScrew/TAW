import { Router } from "express";
import { iPhysicalTable, iTable, Table } from "../../../models/table";
import { authorize, iTokenData } from "../../../utilities/authentication";
import { PhysicalTable } from "../../../models/table";
import mongoose from "mongoose";
import { next_middleware } from "../../../utilities/util";

const physical_tables = Router();

/**
 * @swagger
 * tags:
 *   name: Physical Tables
 *   description: Physical Table management
 */

async function asPhysicalTable(data: unknown, next: Function): Promise<iPhysicalTable> {
    if (typeof data !== 'object') throw new Error("Invalid data type");
    if (data === null) throw new Error("Data is null");

    const { name , capacity, room} = data as iTable;

    if(!!name && typeof name !== 'string') return next({statusCode: 400, error: true, errormessage: 'Name must be a string'});

    if (typeof capacity !== 'number' || typeof room !== 'string') {
        return next({ statusCode: 400, error: true, errormessage: 'Capacity is a number and room is a string' });
    }

    return data as iPhysicalTable;
}

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
    const role = (req.user as iTokenData).role!;
    
    if (!role.canReadPhysicalTables) return next({statusCode: 403, error: true, errormessage: 'Forbidden'});

    PhysicalTable.find().then(physical_table => {
        res.json(physical_table);
    }).catch(err => {
        res.status(500).json(err);
    });
});

physical_tables.get("/:id", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    const id   = req.params.id

    if (!role.canReadPhysicalTables)     return next({statusCode: 403, error: true, errormessage: 'Forbidden'});
    if (id === null) return next({statusCode: 400, error: true, errormessage: 'Bad request'});

    // @ts-ignore - This is a valid ObjectId
    PhysicalTable.findOne({ _id: id }).orFail().then(physical_table => {
        res.json(physical_table);
    }).catch(err => {
        res.status(404).json(err);
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
    try {
        const role = (req.user as iTokenData).role!;

        if (!role.canCreatePhysicalTables) return next({statusCode: 403, error: true, errormessage: 'Forbidden'});

        const orderData = await asPhysicalTable(req.body,next);

        (await PhysicalTable.create(orderData)).save().then(physical_table => {
            console.log(physical_table);
            next_middleware({status: 200, error: false, payload: physical_table}, next);
        }).catch(err => {
            next_middleware({status: 500, error: true, message: err.message}, next);
        });
    } catch (error: any) {
        console.error(error + ''.red)
        next_middleware({status: 400, error: true, message: error}, next);
    }
});

physical_tables.delete("/:id", authorize, async (req, res, next) => {
    try {
        const role = (req.user as iTokenData).role!;
        const id = req.params.id;

        if (!role.canDeleteOrders) {
            return res.status(403).json({ error: true, errormessage: 'Forbidden' });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: true, errormessage: 'Bad request' });
        }

        const deletedPhysicalTable = await PhysicalTable.deleteOne({ _id: id }).orFail();

        if (deletedPhysicalTable.deletedCount === 0) {
            return res.status(404).json({ error: true, errormessage: 'Order not found' });
        }

        res.json({ success: true, message: 'Order deleted successfully' });
        
    } catch (error) {
        next(error); 
    }
});



export default physical_tables; 