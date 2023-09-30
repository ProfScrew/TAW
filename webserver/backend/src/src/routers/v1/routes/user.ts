import { Router } from 'express';
import { User, iUser } from '../../../base/user';
import passport from 'passport';

import { authenticate, create_token, iTokenData, authorize } from '../../../common/authentication';

import { expressjwt } from 'express-jwt';
import { Role } from '../../../base/role';
import { next_middleware } from '../../../common/util';
import { isNumeric } from 'validator';
import { debug } from 'console';

const auth = expressjwt({
    secret: 'secret',
    algorithms: ['HS256']
});

declare global {
    namespace Express {
        interface Request {
            auth: {
                mail: string
            }
        }
    }
}

const user = Router();

interface iNewUser {
    username: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
}


function isNumeric(val: unknown): val is string | number {
    return (
      !isNaN(Number(Number.parseFloat(String(val)))) &&
      isFinite(Number(val))
    );
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
 *  get:
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
user.get('/login', passport.authenticate(authenticate, {session: false}), async (req, res, next) => {
    try{
        const user = req.user as iUser;
        const role = await Role.findOne({name: user.role}).maxTimeMS(1000).orFail().exec();

        const signed = create_token({
            name:    user.name,
            surname: user.surname,
            username:   user.username,
            role:    role
        });

        return next_middleware({ status: 200, error: false, payload: {token: signed} }, next);

    } catch (err: any) {
        
        return next_middleware({ status: 403, error: true, message: 'Forbidden, User has no role' }, next);
    }
});

/**
 * @swagger
 * /users/create:
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
user.post('/create', authorize, (req, res, next) => {
    const user_data = req.body as iNewUser;
    const role = (req.user as iTokenData).role!;

    if (!role.canCreateUsers) return next({ statusCode: 403, error: true, errormessage: 'Forbidden' });

    // Check if user data is valid
    if (!is_new_user(user_data)) {
        return next_middleware({ status: 400, error: true, message: 'Invalid user data' }, next);
    }

    // Create the user
    const user = new User(user_data);
    user.set_password(user_data.password);
    user.role = '';

    // Try to save the user
    user.save().then((data) => {
        return next_middleware({ status: 200, error: false, payload: { id: data._id } }, next);
    }).catch((reason: {code: number, errmsg: string}) => {
        if (reason.code === 11000)
            return next_middleware({ status: 409, error: true, message: 'User already exists' }, next);
        return next_middleware({ status: 500, error: true, message: 'DB error: ' + reason.errmsg }, next);
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
    const role = (req.user as iTokenData).role!;
    const username = req.query.username as string;
    
    if (!role.canReadUsers) return next({ statusCode: 403, error: true, errormessage: 'Forbidden' });

    const query = username ? { username: username } : {};

    User.find(query, (error, users) => {
        if (error) {
            next_middleware({ status: 500, error: true, message: 'An error occurred while fetching users' }, next);
        } else {
            next_middleware({ status: 200, error: false, payload: users }, next);
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
    
    const role = (req.user as iTokenData).role!;
    const username = req.params.username;

    if (!role.canDeleteUsers) {
        return next_middleware({ status: 403, error: true, message: 'Forbidden' }, next);
    }

    if (username === undefined || typeof username !== 'string') {
        return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    }
    
    try {
        await User.deleteOne({ username: username }).orFail();
        next_middleware({ status: 200, error: false,payload:{} }, next);
        
    } catch (err: any) {
        if(err.name === 'DocumentNotFoundError'){
            return next_middleware({ status: 404, error: true, message: 'User not found' }, next);
        }else{
            return next_middleware({ status: 500, error: true, message: 'DB error' }, next);
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
    const role = (req.user as iTokenData).role!;
    const username = req.params.username;

    if (!role.canEditUsers) return next_middleware({ status: 403, error: true, message: 'Forbidden' },next);
    if (username === undefined || typeof username !== 'string') {
        return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    }
    const user_data = req.body as Partial<iNewUser>;

    if(is_new_user(user_data) === false){
        return next_middleware({ status: 400, error: true, message: 'Bad request' }, next);
    }
    console.log(user_data);
    const exist = await User.findOne({ username: username });
    if (!exist) {
        return next_middleware({ status: 404, error: true, message: 'User not found' }, next);
    }
    const new_user = new User({
        ...user_data,
        username: username,
        _id: exist._id
    });
    if(user_data.password !== undefined){
        new_user.set_password(user_data.password);
    }
    try{
        await User.findOneAndUpdate({ username: username }, new_user, { new: true }).maxTimeMS(1000).orFail();
        return next_middleware({ status: 200, error: false, payload: {} }, next);
    }catch(err){
        return next_middleware({ status: 500, error: true, message: 'DB error' }, next);
    }

    
});


export default user;