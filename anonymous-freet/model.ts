import type { Types, PopulatedDoc, Document } from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * This file defines the properties stored in an Anonymous Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Anonymous Freet on the backend
export type AnonymousFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  anonymousAuthorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Anonymous Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AnonymousFreetSchema = new Schema<AnonymousFreet>({
  // The author userId
  anonymousAuthorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
  },
  // The date the anonymous freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the anonymous freet
  content: {
    type: String,
    required: true
  },
  // The date the anonymous freet was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const AnonymousFreetModel = model<AnonymousFreet>('AnonymousFreet', AnonymousFreetSchema);
export default AnonymousFreetModel;
