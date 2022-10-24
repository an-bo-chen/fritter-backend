import type { HydratedDocument, Types } from 'mongoose';
import type { AnonymousFreet } from './model';
import AnonymousFreetModel from './model';

class AnonymousFreetCollection {
  /**
   * Add an anonymous freet to the collection
   *
   * @param {string} anonymousAuthorId - The id of the author of the anonymous freet
   * @param {string} content - The id of the content of the anonymous freet
   * @return {Promise<HydratedDocument<AnonymousFreet>>} - The newly created anonymous freet
   */
  static async addOne(anonymousAuthorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<AnonymousFreet>> {
    const date = new Date();
    const anonymousfreet = new AnonymousFreetModel({
      anonymousAuthorId,
      dateCreated: date,
      content,
      dateModified: date
    });
    await anonymousfreet.save(); // Saves freet to MongoDB
    return anonymousfreet;
  }

  /**
   * Find an anonymous freet by anonymousFreetId
   *
   * @param {string} anonymousFreetId - The id of the anonymous freet to find
   * @return {Promise<HydratedDocument<AnonymousFreet>> | Promise<null> } - The anonymous freet with the given anonymousFreetId, if any
   */
  static async findOne(anonymousFreetId: Types.ObjectId | string): Promise<HydratedDocument<AnonymousFreet>> {
    return AnonymousFreetModel.findOne({ _id: anonymousFreetId });
  }

  /**
   * Get all the anonymous freets in the database
   *
   * @return {Promise<HydratedDocument<AnonymousFreet>[]>} - An array of all of the anonymous freets
   */
  static async findAll(): Promise<Array<HydratedDocument<AnonymousFreet>>> {
    // Retrieves anonymous freets and sorts them from most to least recent
    return AnonymousFreetModel.find({}).sort({ dateModified: -1 });
  }

  /**
   * Get all the anonymous freets in by given author
   *
   * @param {string} anonymousAuthorId - The id of author of anonymous freets
   * @return {Promise<HydratedDocument<AnonymousFreet>[]>} - An array of all of the anonymous freets
   */
  static async findAllByAnonymousUserId(anonymousAuthorId: Types.ObjectId | string): Promise<Array<HydratedDocument<AnonymousFreet>>> {
    return AnonymousFreetModel.find({ anonymousAuthorId: anonymousAuthorId });
  }

  /**
   * Update an anonymous freet with the new content
   *
   * @param {string} anonymousFreetId - The id of the anonymous freet to be updated
   * @param {string} content - The new content of the anonymous freet
   * @return {Promise<HydratedDocument<AnonymousFreet>>} - The newly updated anonymous freet
   */
  static async updateOne(anonymousFreetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<AnonymousFreet>> {
    const anonymousFreet = await AnonymousFreetModel.findOne({ _id: anonymousFreetId });
    anonymousFreet.content = content;
    anonymousFreet.dateModified = new Date();
    await anonymousFreet.save();
    return anonymousFreet;
  }

  /**
   * Delete an anonymous freet with given anonymousFreetId.
   *
   * @param {string} anonymousFreetId- The anonymousFreetId of anonymous freet to delete
   * @return {Promise<Boolean>} - true if the anonymous freet has been deleted, false otherwise
   */
  static async deleteOne(anonymousFreetId: Types.ObjectId | string): Promise<boolean> {
    const anonymousFreet = await AnonymousFreetModel.deleteOne({ _id: anonymousFreetId });
    return anonymousFreet !== null;
  }

  /**
   * Delete all the anonymous freets by the given author
   *
   * @param {string} anonymousAuthorId - The id of author of anonymous freets
   */
  static async deleteMany(anonymousAuthorId: Types.ObjectId | string): Promise<void> {
    await AnonymousFreetModel.deleteMany({ anonymousAuthorId });
  }
}

export default AnonymousFreetCollection;
