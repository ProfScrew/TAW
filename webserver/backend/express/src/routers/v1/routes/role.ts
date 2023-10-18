import { Router } from "express";
import { iRole, Role } from "../../../models/role";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { next_middleware } from "../../../middlewares/http.middleware";

const roles = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Roles management
 */

function asRole(data: unknown): iRole {
    if (typeof data !== 'object') throw new Error("Invalid data type");
    if (data === null) throw new Error("Data is null");
    
    return data as iRole;
}

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     description: Create a new role
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: The role was successfully created
 *       400:
 *         description: Invalid role data provided
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Forbidden, permission denied
 *       500:
 *         description: Internal Server Error
 */
roles.post("/", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    if (!role.canCreateRoles) return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);

    const roleData = asRole(req.body);
    Role.create(roleData).then(role => {
        next_middleware({ status: 200, error: false, payload: role }, next);
    }).catch(err => {
        if (err.name === 'ValidationError') {
            next_middleware({ status: 400, error: true, message: err.message }, next);
        }
        next_middleware({ status: 500, error: true, message: err }, next);
    });
});

/**
 * @swagger
 * /roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Get a role by name, or get a list of roles if no name is provided.
 *     description: Get a role by name, or get a list of roles if no name is provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the role to get.
 *     responses:
 *       200:
 *         description: Successful response with the list of roles.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
roles.get("/", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    const name = req.query.name as string;
    
    if (!role.canReadRoles) return next({ statusCode: 403, error: true, errormessage: 'Forbidden' });

    const query = name ? { name: name } : {};

    Role.find(query, (error, users) => {
        if (error) {
            next_middleware({ status: 500, error: true, message: 'An error occurred while fetching users' }, next);
        } else {
            next_middleware({ status: 200, error: false, payload: users }, next);
        }
    });
});

/**
 * @swagger
 * /roles/{name}:
 *   put:
 *     summary: Update a role by name
 *     description: Update a role by name
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The role name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: The role updated successfully
 *       400:
 *         description: Invalid role data provided
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Forbidden, permission denied
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal Server Error
 */
roles.put("/:name", authorize, (req, res, next) => {
    const role = (req.user as iTokenData).role!;
    const name = req.params.name;
    const roleData = asRole(req.body);

    if (!role.canEditRoles) {
        return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);
    }

    if (name === undefined || typeof name !== 'string') {
        return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    }

    Role.findOneAndUpdate({ name: name }, roleData, { new: true }, (error, role) => {
        if (error) {
            if(error.name === 'ValidationError'){
                return next_middleware({ status: 400, error: true, message: error.message }, next);
            }
            next_middleware({ status: 500, error: true, message: 'An error occurred while updating the role' }, next);
        } else if (!role) {
            next_middleware({ status: 404, error: true, message: 'Role not found' }, next);
        } else {
            next_middleware({ status: 200, error: false, payload: role }, next);
        }
    });
});

/**
 * @swagger
 * /roles/{name}:
 *   delete:
 *     summary: Delete a role by name
 *     description: Delete a role by name
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The role name
 *     responses:
 *       200:
 *         description: The role deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal Server Error
 */
roles.delete("/:name", authorize, async (req, res, next) => {//TODO: if delete role, put user to default role???
    const role = (req.user as iTokenData).role!;
    const name = req.params.name;

    if (!role.canDeleteUsers) {
        return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);
    }

    if (name === undefined || typeof name !== 'string') {
        return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    }
    
    try {
        await Role.deleteOne({ name:name }).orFail();
        next_middleware({ status: 200, error: false,payload:{} }, next);
        
    } catch (err: any) {
        if(err.name === 'DocumentNotFoundError'){
            return next_middleware({ status: 404, error: true, message: 'Role not found' }, next);
        }else{
            return next_middleware({ status: 500, error: true, message: 'DB error' }, next);
        }
    }
});



export default roles;