import { Router } from 'express';
import { User, iUser, iUserForm, verifyUserData } from '../../../models/user.model';
import passport from 'passport';

import { authenticate, create_token, iTokenData, authorize, blacklistUser } from '../../../middlewares/auth.middleware';
// @ts-ignore
import { isNumeric } from 'validator';
import { iCategory } from '../../../models/category.model';
import { iRoom } from '../../../models/room.model';
import { cResponse, eHttpCode } from '../../../middlewares/response.middleware';
import { io } from '../../../app';
import { eListenChannels } from '../../../models/channels.enum';


const user = Router();

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
 *     404:
 *       description: User not found. Wrong username.
 *     500:
 *      description: Internal Server Error. DB error. User does not have a role. Etc...
 */
user.post('/login', passport.authenticate(authenticate, { session: false }), async (req, res, next) => {

    const user = req.user as iUser;

    var signed = create_token({
        name: user.name,
        surname: user.surname,
        username: user.username,
        role: user.role,
        category: user.category ? user.category[0] : undefined,
        room: user.room ? user.room[0] : undefined,
    });

    return next(cResponse.genericMessage(eHttpCode.OK, signed));
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
 *         description: Data not valid.
 */
user.post('/', authorize, (req, res, next) => {
    const user_data = req.body as iUserForm;
    const requester = req.user as iTokenData;

    if (!requester || !requester.role || !requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    // Check if user data is valid
    if (!verifyUserData(user_data, false)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Data not valid'));
    }

    // Create the user
    const user = new User(user_data);
    user.setPassword(user_data.password);

    // Try to save the user
    user.save().then((data) => {
        io.to('admin').emit(eListenChannels.users, { message: 'User list updated!' });
        return next(cResponse.genericMessage(eHttpCode.OK, { id: data._id }));
    }).catch((reason: { code: number, errmsg: string }) => {
        if (reason.code === 11000)
            return next(cResponse.error(409, 'Username or Phone already exists'));
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
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
user.get('/', authorize, (req, res, next) => {
    const requester = (req.user as iTokenData);
    const username = req.query.username as string;
    
    
    
    if (!requester.role.admin) return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));

    const query = username ? { username: username } : {};

    User.find(query, (error, users) => {
        if (error) {
            next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'An error occurred while fetching users'));

        } else {
            //io.to('admin').emit('userListUpdated', { message: 'User list updated!' });
            //send bradcast to all users
            //io.local.emit('userListUpdated', { message: 'User list updated!' });
            
            //io.emit('userListUpdated', { message: 'User list updated!' });
            next(cResponse.genericMessage(eHttpCode.OK, users));
        }
    });
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
 *       409:
 *         description: Phone already in use by another user.
 *       500:
 *         description: An error occurred while updating the user.
 */
user.put("/:username", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const username = req.params.username;

    if (!requester.role.admin) return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    
    if (username === undefined || typeof username !== 'string') {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Bad request'));
    }
    const user_data = req.body as Partial<iUserForm>;
    

    if (verifyUserData(user_data, true) === false) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Data not valid'));
    }
    const exist = await User.findOne({ username: username });
    if (!exist) {
        return next(cResponse.error(eHttpCode.NOT_FOUND, 'User not found'));
    }
    const new_user = new User({
        ...user_data,
        username: username,
        _id: exist._id
    });
    if (user_data.password !== undefined) {
        new_user.setPassword(user_data.password);
    }
    try {
        await User.findOneAndUpdate({ username: username }, new_user, { new: true }).maxTimeMS(1000).orFail();
        blacklistUser(username, new Date(Date.now()));
        io.to('admin').emit(eListenChannels.users, { message: 'User list updated!' });
        return next(cResponse.genericMessage(eHttpCode.OK));
    } catch (reason: any) {
        if (reason.code === 11000)
            return next(cResponse.error(409, 'Phone already in use by another user '));
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + reason.errmsg));
    }
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

    const requester = (req.user as iTokenData);
    const username = req.params.username;

    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    }

    if (username === undefined || typeof username !== 'string') {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Bad request'));
    }

    try {
        await User.deleteOne({ username: username }).orFail();
        io.to('admin').emit(eListenChannels.users, { message: 'User list updated!' });
        next(cResponse.genericMessage(eHttpCode.OK));

    } catch (err: any) {
        if (err.name === 'DocumentNotFoundError') {
            return next(cResponse.error(eHttpCode.NOT_FOUND, 'User not found'));
        } else {
            return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
        }
    }
});



export default user;