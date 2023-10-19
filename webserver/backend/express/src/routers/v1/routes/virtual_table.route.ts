import { NextFunction, Router } from "express";
import { iTable, iPhysicalTable, PhysicalTable, Table, TableStatus } from "../../../models/virtual_table.model";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { next_middleware } from "../../../middlewares/http.middleware";
import mongoose from "mongoose";

const tables = Router();

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Virtual Table Management
 */

async function asTable(data: Partial<iTable>, next: NextFunction): Promise<iTable|void> {
    const empty_table: Partial<iTable> = {
        physical_tables: [],
        guests: 0,
        status: TableStatus.UNSET
    };

    data = { ...empty_table, ...data };

    if (data.status !== TableStatus.UNSET) return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);


    if (typeof data !== 'object') throw new Error("Invalid data type");
    if (data === null) throw new Error("Data is null");

    const { physical_tables, status, guests } = data as iTable;

    if (typeof status !== 'string')      return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    if (typeof guests !== 'number')      return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    if (!Array.isArray(physical_tables)) return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);

    if (isNaN(guests)) return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    if (guests < 0)    return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);

    //const tables = await PhysicalTable.find({ _id: { $in: physical_tables } })
    //the two line below fix the line above ??

    const tables = await PhysicalTable.find({ _id: { $in: physical_tables } });

    if (tables.length !== physical_tables.length) return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    
    const rooms = tables.map(table => table.room);
    if (new Set(rooms).size !== 1) throw next_middleware({ status: 400, error: true, message: 'Bad request' }, next);

    const capacity = tables.reduce((acc, table) => acc + table.capacity, 0);
    (data as iTable).capacity = capacity;

    return data as iTable;
}

//TODO: Set table status as LOCKED if and only if the user is a waiter and the table is not
//      under his/her responsibility

/**
 * @swagger
 * /tables:
 *   get:
 *     tags:
 *       - Tables
 *     summary: Retrieve a list of virtual tables.
 *     description: Retrieve a list of virtual tables that are registered in the system.
 *     security:
 *       - bearerAuth: []
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
    const role = (req.user as iTokenData).role!;
    
    if (!role.canReadTables) return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);

    Table.find().exec((err,tables) => {
        if (err) return next_middleware({ status: 200, error: false, payload: [] }, next);
        
        return next_middleware({ status: 200, error: false, payload: tables }, next);
    });
});

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     tags:
 *       - Tables
 *     summary: Retrieve a virtual table by id.
 *     description: Retrieve a virtual table by id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A table was found.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Table not found.
 *       500:
 *         description: An error occurred while fetching the table.
 */
tables.get("/:id", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    const id   = req.params.id;

    if (!role.canReadTables)     return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);
    if (id === null) return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);

    Table.findOne({id: id}).orFail().exec((err, table) => {
        if (err) return next_middleware({ status: 404, error: true, message: err.message }, next);
        next_middleware({ status: 200, error: false, payload: table }, next);
    });
});


/**
 * @swagger
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
 *       description: Table data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: Table created successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: An error occurred while creating the table.
 */
tables.post("/", authorize, async (req, res, next) => {
    const role = (req.user as iTokenData).role!;

    if (!role.canCreateTables) return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);

    const tableData = await asTable(req.body,next);
    if (!tableData) return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    
    Table.create(tableData).then(table => {
        next_middleware({ status: 200, error: false, payload: table }, next);
    }).catch(err => {
        next_middleware({ status: 500, error: true, message: err.message }, next);
    });
});

/**
 * @swagger
 * /tables/generate:
 *   post:
 *     tags:
 *       - Tables
 *     summary: Generate a virtual table for each physical table saved in the database.
 *     description: Generate a virtual table for each physical table saved in the database.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tables generated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: An error occurred while generating the tables.
 */
tables.post("/service/init", authorize, async (req, res, next) => {
    const role = (req.user as iTokenData).role!;

    if (!role.canCreateTables || !role.canReadPhysicalTables) 
        return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);

    // Check if there are any tables in the database
    const tables = await Table.find().limit(1);

    if (tables.length !== 0)
        return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);

    const physical_tables = await PhysicalTable.find();

    // Create a virtual table for each physical table
    const virtual_tables = physical_tables.map(table => {
        return {
            name: table.name,
            capacity: table.capacity,
            physical_tables: [table._id],
            status: TableStatus.UNSET,
            guests: 0
        } as iTable;
    });

    // Save the virtual tables
    Table.insertMany(virtual_tables).then(tables => {
        next_middleware({ status: 200, error: false, payload: { generated_ids: tables.map(t => t._id) } }, next);
    }).catch(err => {
        console.log(err + ''.red);
        
        next_middleware({ status: 500, error: true, message: err.message }, next);
    });
});

/**
 * @swagger
 * /service/close:
 *   post:
 *     tags:
 *       - Tables
 *     summary: Delete all the virtual tables.
 *     description: Delete all the virtual tables.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tables deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: An error occurred while deleting the tables.
 */
tables.post("/service/close", authorize, async (req, res, next) => {
    const role = (req.user as iTokenData).role!;

    if (!role.canDeleteTables || !role.canReadTables) 
        return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);

    // Get all the tables
    const tables = await Table.find();

    // Check if there are any open orders on the tables
    if (tables.some(table => table.order !== undefined))
        return next_middleware({ status: 403, error: true, message: 'Cannot delete a table with an open order linked to it' }, next);

    // Delete all the tables
    Table.deleteMany().then(() => {
        next_middleware({ status: 200, error: false, payload: {} }, next);
    }).catch(err => {
        next_middleware({ status: 500, error: true, message: err.message }, next);
    });
});


/**
 * @swagger
 * /tables/{id}:
 *   delete:
 *     tags:
 *       - Tables
 *     summary: Delete a virtual table.
 *     description: Delete a virtual table.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Table deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Table not found.
 */
tables.delete("/:id", authorize, async (req, res, next) => {
    try {
        const role = (req.user as iTokenData).role!;
        const id = req.params.id;

        if (!role.canDeleteTables) {
            return res.status(403).json({ error: true, errormessage: 'Forbidden' });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: true, errormessage: 'Bad request' });
        }

        const deletedTable = await Table.deleteOne({ id: id }).orFail();

        if (deletedTable.deletedCount === 0) {
            return res.status(404).json({ error: true, errormessage: 'Table not found' });
        }

        res.json({ success: true, message: 'Table deleted successfully' });
        
    } catch (error) {
        next(error); 
    }
});

/**
 * @swagger
 * /tables/{id}/physical_tables:
 *  get:
 *   tags:
 *    - Tables
 *   summary: Retrieve a list of physical tables associated to a virtual table.
 *   description: Retrieve a list of physical tables associated to a virtual table.
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    200:
 *     description: A list of tables.
 *    401:
 *     description: Unauthorized.
 *    403:
 *     description: Forbidden.
 *    500:
 *     description: An error occurred while fetching tables.
 *   parameters:
 *   - in: path
 *     name: id
 *     required: true
 *     schema:
 *      type: string
 */
tables.get("/:id/physical_tables", authorize, async (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    const id   = req.params.id;

    if (!role.canReadTables)     return next({statusCode: 403, error: true, errormessage: 'Forbidden'});
    if (id === null) return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);


    Table.findOne({ id: id }).orFail().then(table => {
        res.json(table.physical_tables);
    }).catch(err => {
        res.status(404).json(err);
    });
});




export default tables;