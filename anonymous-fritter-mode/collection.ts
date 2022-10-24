import type { HydratedDocument, Types } from 'mongoose';
import type { AnonymousMode } from './model';
import AnonymousModeModel from './model';

class AnonymousModeCollection {
    /**
     * Add an anonymous mode to the collection
     *
     * @param {string} userId - The id of the user
     * @return {Promise<HydratedDocument<AnonymousMode>>} - The newly created anonymous mode
     */
    static async addOne(userId: Types.ObjectId | string): Promise<HydratedDocument<AnonymousMode>> {
        const anonymousMode = new AnonymousModeModel({
            userId,
            isAnonymousMode: false
        });
        await anonymousMode.save(); // Saves freet to MongoDB
        return anonymousMode.populate('userId');
    }

    /**
     * Find an anonymous mode by userId
     *
     * @param {string} userId - The id of the user
     * @return {Promise<HydratedDocument<AnonymousMode>> | Promise<null> } - The anonymous mode with the given useId, if any
     */
    static async findOne(userId: Types.ObjectId | string): Promise<HydratedDocument<AnonymousMode>> {
        return AnonymousModeModel.findOne({ userId: userId }).populate('userId');
    }

    /**
     * Update an anonymous mode by switching anonymous mode on or off
     *
     * @param {string} userId - The id of the user
     * @param {boolean} mode - The switch for the anonymous mode
     * @return {Promise<HydratedDocument<AnonymousMode>>} - The newly updated anonymous Mode
     */
    static async updateOne(userId: Types.ObjectId | string, mode: boolean): Promise<HydratedDocument<AnonymousMode>> {
        const anonymousMode = await AnonymousModeModel.findOne({ userId: userId });
        anonymousMode.isAnonymousMode = mode;
        await anonymousMode.save();
        return anonymousMode.populate('userId');
    }

    /**
     * Delete an anonymous mode with given userId.
     *
     * @param {string} userId- The id of the user
     * @return {Promise<Boolean>} - true if the anonymous mode has been deleted, false otherwise
     */
    static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
        const anonymousMode = await AnonymousModeModel.deleteOne({ userId: userId });
        return anonymousMode !== null;
    }
}

export default AnonymousModeCollection;