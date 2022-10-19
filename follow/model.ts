import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { User } from 'user/model';

/**
 * This file defines the properties stored in a Follow
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
export type Follow = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    following: Map<String, Set<User>> // Maps each user id to a set of users they are following
    follower: Map<String, Set<User>> // Maps each user id to a set of users that are followers of them
};

// Mongoose schema definition for interfacing with a MongoDB table
// Follows stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
    // A mapping from each user to a set of users who they are following
    following: {
        type: Map,
        of: Set<User>,
        required: true
    },

    // A mapping from each user to a set of users who are followers of them
    follower: {
        type: Map,
        of: Set<User>,
        required: true
    }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
