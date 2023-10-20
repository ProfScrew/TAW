import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './user_action.object';
import { iUser } from './user.model';

interface iBlacklistToken {
    _id: Schema.Types.ObjectId;
    user: iUser['username'];
    expires: Date;
}

const BlacklistTokenSchema = new Schema<iBlacklistToken>({
    user: {type: String, required: true},
    expires: {type: Date, required: true}
},{
    versionKey: false,
    collection: 'BlacklistTokens'
});

export const BlacklistToken = model<iBlacklistToken>('BlacklistToken', BlacklistTokenSchema);