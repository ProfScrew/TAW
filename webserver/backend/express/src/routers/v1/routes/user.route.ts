import { Router } from 'express';
import { User, iUser } from '../../../models/user.model';
import passport from 'passport';

import { authenticate, create_token, iTokenData, authorize } from '../../../middlewares/auth.middleware';
// @ts-ignore
import { isNumeric } from 'validator';
import { iCategory } from '../../../models/category.model';
import { iRoom } from '../../../models/room.model';
import { cHttpMessages } from '../../../utilities/http_messages.util';

const user = Router();

interface iNewUser {
    username: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
    category?: iCategory['_id'][];
    room?: iRoom['_id'][];
    role: {
        admin: boolean;
        waiter: boolean;
        production: boolean;
        cashier: boolean;
        analytics: boolean;
    }
}

function is_new_user(data: unknown): boolean {
    if (typeof data !== 'object' || data === null) return false;
    const user = data as iNewUser;
    
    if (typeof user.username   !== 'string') return false;
    if (typeof user.phone   !== 'string') return false;
    if (isNumeric(user.phone) === false) return false;
    if (typeof user.name    !== 'string') return false;
    if (typeof user.surname !== 'string') return false;
    if (typeof user.password !== 'string') return false;
    console.log(user); 
    return true;
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/login:
 *  post:
 *   tags: [Users]
 *   summary: Login to the system.
 *   description: Login to the system using the provided credentials.
 *   security:
 *    - basicAuth: []
 *   responses:
 *     200:
 *       description: Successfully logged in.
 *     401:
 *       description: Unauthorized. Wrong Password.
 *     403:
 *       description: Forbidden. User does not have a role.
 *     404:
 *       description: User not found. Wrong username.
 *     500:
 *      description: Internal Server Error. DB error. User does not have a role. Etc...
 */
user.post('/login', passport.authenticate(authenticate, {session: false}), async (req, res, next) => {
    try {
        const user = req.user as iUser;

        var signed = create_token({
            name:       user.name,
            surname:    user.surname,
            username:   user.username,
            role:       user.role,
            category:   user.category ? user.category[0] : undefined,
            room:       user.room ? user.room[0] : undefined,
        });

        return next({ status: 200, error: false, payload: { token: signed } });
    } catch (err: any) {
        
        return next({ status: 403, error: true, message: 'Forbidden, User has no role' });
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user.
 *     description: Create a new user in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: Invalid user data.
 */
user.post('/', authorize, (req, res, next) => {
    const user_data = req.body as iNewUser;
    const author = (req.user as iTokenData);

    if (!author.role.admin) return next(eHttpMessages.forbidden);

    // Check if user data is valid
    if (!is_new_user(user_data)) {
        return next({ status: 400, error: true, message: 'Invalid user data' });
    }

    // Create the user
    const user = new User(user_data);
    user.setPassword(user_data.password);

    // Try to save the user
    user.save().then((data) => {
        return next({ status: 200, error: false, payload: { id: data._id } });
    }).catch((reason: {code: number, errmsg: string}) => {
        if (reason.code === 11000)
            return next({ status: 409, error: true, message: 'User already exists' });
        return next({ status: 500, error: true, message: 'DB error: ' + reason.errmsg });
    });
});

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by username, or get all the users if no username is provided.
 *     description: Get a user by username, or get all the users if no username is provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: The username of the user to get.
 *     responses:
 *       200:
 *         description: Successful response with the list of users.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
user.get('/', authorize,  (req, res, next) => {
    const author = (req.user as iTokenData);
    const username = req.query.username as string;
    
    if (!author.role.admin) return next({ statusCode: 403, error: true, errormessage: 'Forbidden' });

    const query = username ? { username: username } : {};

    User.find(query, (error, users) => {
        if (error) {
            next({ status: 500, error: true, message: 'An error occurred while fetching users' });
        } else {
            next({ status: 200, error: false, payload: users });
        }
    });
});

/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by username.
 *     description: Delete a user by username.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user to delete.
 *     requestBody:
 *       description: User data.
 *       required: true
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 *       500:
 *         description: An error occurred while deleting the user in DB.
 */
user.delete("/:username", authorize, async (req, res, next) => {
    
    const author = (req.user as iTokenData);
    const username = req.params.username;

    if (!author.role.admin) {
        return next({ status: 403, error: true, message: 'Forbidden' });
    }

    if (username === undefined || typeof username !== 'string') {
        return next({ status: 400, error: true, message: 'Bad request' });
    }
    
    try {
        await User.deleteOne({ username: username }).orFail();
        next({ status: 200, error: false,payload:{} });
        
    } catch (err: any) {
        if(err.name === 'DocumentNotFoundError'){
            return next({ status: 404, error: true, message: 'User not found' });
        }else{
            return next({ status: 500, error: true, message: 'DB error' });
        }
    }
});

/**
 * @swagger
 * /users/{username}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user by username.
 *     description: Update a user by username.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user to update.
 *     requestBody:
 *       description: User data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 *       500:
 *         description: An error occurred while updating the user.
 */
user.put("/:username", authorize, async (req, res, next) => {
    const author = (req.user as iTokenData);
    const username = req.params.username;

    if (!author.role.admin) return next({ status: 403, error: true, message: 'Forbidden' });
    if (username === undefined || typeof username !== 'string') {
        return next({ status: 400, error: true, message: 'Bad request' });
    }
    const user_data = req.body as Partial<iNewUser>;

    if(is_new_user(user_data) === false){
        return next({ status: 400, error: true, message: 'Bad request' });
    }
    console.log(user_data);
    const exist = await User.findOne({ username: username });
    if (!exist) {
        return next({ status: 404, error: true, message: 'User not found' });
    }
    const new_user = new User({
        ...user_data,
        username: username,
        _id: exist._id
    });
    if(user_data.password !== undefined){
        new_user.setPassword(user_data.password);
    }
    try{
        await User.findOneAndUpdate({ username: username }, new_user, { new: true }).maxTimeMS(1000).orFail();
        return next({ status: 200, error: false, payload: {} });
    }catch(err){
        return next({ status: 500, error: true, message: 'DB error' });
    }

    
});


export default user;