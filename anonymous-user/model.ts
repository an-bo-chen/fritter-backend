import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in an Anonymous User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Anonymous User on the backend
export type AnonymousUser = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  publicUserId: Types.ObjectId;
  dateJoined: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Anonymous Uers stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AnonymousUserSchema = new Schema({
    publicUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    dateJoined: {
        type: Date,
        required: true
    }
});

const AnonymousUserModel = model<AnonymousUser>('AnonymousUser', AnonymousUserSchema);
export default AnonymousUserModel;
