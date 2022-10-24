import type { HydratedDocument, Types } from 'mongoose';
import type { AnonymousUser } from './model';
import AnonymousUserModel from './model';
import UserCollection from '../user/collection';

class AnonymousUserCollection {
    /**
     * Add a new anonymous user
     *
     * @param {string} publicUserId - The id of an associated public user
     * @return {Promise<HydratedDocument<AnonymousUser>>} - The newly created anonymous user
     */
    static async addOne(publicUserId: Types.ObjectId | string): Promise<HydratedDocument<AnonymousUser>> {
        const publicUser = await UserCollection.findOneByUserId(publicUserId);
        const dateJoined = publicUser.dateJoined;

        const anonymousUser = new AnonymousUserModel({
            publicUserId: publicUserId,
            dateJoined: dateJoined
        });
        await anonymousUser.save(); // Saves user to MongoDB
        return anonymousUser;
    }

    /**
     * Find an anonymous user by anonyousUserId.
     *
     * @param {string} anonymousUserId - The anonymousUserId of the anonymous user to find
     * @return {Promise<HydratedDocument<AnonymousUser>> | Promise<null>} - The anonymous user with the given anonymousUserId, if any
     */
    static async findOneByAnonymousUserId(anonymousUserId: Types.ObjectId | string): Promise<HydratedDocument<AnonymousUser>> {
        return AnonymousUserModel.findOne({ _id: anonymousUserId });
    }

    /**
     * Find an anonymous user by publicUserId.
     *
     * @param {string} publicUserId - The id of an associated public user
     * @return {Promise<HydratedDocument<AnonymousUser>> | Promise<null>} - The anonymous user of the associated public user
     */
    static async findOneByPublicUserId(publicUserId: Types.ObjectId | string): Promise<HydratedDocument<AnonymousUser>> {
        return AnonymousUserModel.findOne({ publicUserId: publicUserId });
    }

    /**
     * Delete an anonymous user from the collection.
     *
     * @param {string} publicUserId - The id of an associated public user
     * @return {Promise<Boolean>} - true if the anonymous user has been deleted, false otherwise
     */
    static async deleteOne(publicUserId: Types.ObjectId | string): Promise<boolean> {
        const anonymousUser = await AnonymousUserModel.deleteOne({ publicUserId: publicUserId });
        return anonymousUser !== null;
    }
}

export default AnonymousUserCollection;