import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

export type AnonymousMode = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId;
    isAnonymousMode: boolean;
};

export type PopulatedAnonymousMode = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: User;
    isAnonymousMode: boolean;
};

const AnonymousModeSchema = new Schema<AnonymousMode>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isAnonymousMode: {
        type: Boolean,
        required: true
    }
});

const AnonymousModeModel = model<AnonymousMode>('AnonymousMode', AnonymousModeSchema);
export default AnonymousModeModel;