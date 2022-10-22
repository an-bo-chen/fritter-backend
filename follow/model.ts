import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in a Follow
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
export type Follow = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    toBeFollowed: Types.ObjectId;
    follower: Types.ObjectId;
    dateCreated: Date;
};

export type PopulatedFollow = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    toBeFollowed: User;
    follower: User;
    dateCreated: Date;
};


// Mongoose schema definition for interfacing with a MongoDB table
// Follows stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
    toBeFollowed: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    follower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dateCreated: {
        type: Date,
        require: true
    }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
