import { ObjectId } from "mongoose";

export interface iUserAction {
    actor:         { username: string, name: string };
    timestamp:     Date;
}

export const UserAction = {
    actor: {
        username: {type: String, required: true},
        name:  {type: String, required: true}
    },

    timestamp: {type: Date, required: true}
}