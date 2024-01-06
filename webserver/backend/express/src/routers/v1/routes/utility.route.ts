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
import { Redis } from '../../../services/redis.service';

const utility = Router();

/**
 * @swagger
 * tags:
 *   name: Utility
 *   description: Utility for Develop and Debug Application
 */

/**
 * @swagger
 * /utility/resetCache:
 *   get:
 *     tags: [Utility]
 *     summary: Reset the cache.
 *     description: Reset the cache used by the application.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache reset successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */


utility.get('/resetCache', authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) return next(cResponse.genericMessage(eHttpCode.FORBIDDEN));
    await Redis.deleteAll();
    return next(cResponse.genericMessage(eHttpCode.OK));
});

export default utility;