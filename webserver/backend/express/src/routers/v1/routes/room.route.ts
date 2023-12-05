import { Router } from "express";
import { authorize, iTokenData } from "../../../middlewares/auth.middleware";
import { Room, iRoom, verifyRoomData } from "../../../models/room.model";
import mongoose, { isValidObjectId } from 'mongoose';
import { cResponse, eHttpCode } from "../../../middlewares/response.middleware";
import { Redis } from "../../../services/redis.service";
import { io } from '../../../app';
import { eListenChannels } from "../../../models/channels.enum";

const rooms = Router();


/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get rooms
 *     description: Retrieve a list of rooms or a single room by ID.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the room to get. If not provided, it returns a list of all rooms.
 *     responses:
 *       200:
 *         description: Successful response with the list of rooms or a single room.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
rooms.get("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.query.id as string;
    const query: any = id ? { _id: id } : {};

    if (id && !isValidObjectId(id)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, 'Invalid id'));
    }
    const cachedData = await Redis.get<iRoom[]>("Room:" + JSON.stringify(query), true);
    if (cachedData !== null) {
        return next(cResponse.genericMessage(eHttpCode.OK, cachedData));
    }


    Room.find(query).then((data) => {
        Redis.set<iRoom[]>("Room:" + JSON.stringify(query), data);
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     description: Create a new room in the system.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Room object to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room successfully created.
 *       400:
 *         description: Bad Request - The room already exists or data not valid.
 *       401:
 *         description: Unauthorized - User is not authorized to create a room.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */
rooms.post("/", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const room = req.body as iRoom;
    if (!verifyRoomData(room)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Room data is not valid"));
    }

    const newRoom = new Room(room);
    newRoom._id = new mongoose.Types.ObjectId();

    newRoom.save().then((data) => {
        Redis.delete("Room:" + JSON.stringify({}));
        io.emit(eListenChannels.rooms, { message: 'Rooms list updated!' });
        return next(cResponse.genericMessage(eHttpCode.CREATED, data));
    }).catch((err) => {
        console.log(err.message);
        if (err.code === 11000) {
            return next(cResponse.error(eHttpCode.BAD_REQUEST, "Room already exists"));
        }
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });

});

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update a room by ID
 *     description: Update an existing room in the system by providing its ID.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the room to update.
 *         required: true
 *     requestBody:
 *       description: Updated room data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room successfully updated.
 *       400:
 *         description: Bad Request - The provided room data is not valid.
 *       401:
 *         description: Unauthorized - User is not authorized to update a room.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */


rooms.put("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id as string;
    console.log(id);
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }
    const room = req.body as iRoom;
    if (!verifyRoomData(room)) {
        return next(cResponse.error(eHttpCode.BAD_REQUEST, "Room data is not valid"));
    }
    Room.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { name: room.name }).then((data) => {
        Redis.delete("Room:" + JSON.stringify({}));
        Redis.delete("Room:" + JSON.stringify({ _id: id }));
        io.emit(eListenChannels.rooms, { message: 'Rooms list updated!' });
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });

});

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room by ID
 *     description: Delete an existing room in the system by providing its ID.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the room to delete.
 *         required: true
 *     responses:
 *       200:
 *         description: Room successfully deleted.
 *       401:
 *         description: Unauthorized - User is not authorized to delete a room.
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 */

rooms.delete("/:id", authorize, async (req, res, next) => {
    const requester = (req.user as iTokenData);
    const id = req.params.id as string;
    if (!requester.role.admin) {
        return next(cResponse.genericMessage(eHttpCode.UNAUTHORIZED));
    }

    Room.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then((data) => {
        Redis.delete("Room:" + JSON.stringify({}));
        Redis.delete("Room:" + JSON.stringify({ _id: id }));
        io.emit(eListenChannels.rooms, { message: 'Rooms list updated!' });
        return next(cResponse.genericMessage(eHttpCode.OK, data));
    }).catch((err) => {
        return next(cResponse.serverError(eHttpCode.INTERNAL_SERVER_ERROR, 'DB error: ' + err.errmsg));
    });
});

export default rooms;