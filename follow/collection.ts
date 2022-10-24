import type { HydratedDocument, Types } from 'mongoose';
import type { Follow } from './model';
import FollowModel from './model';

class FollowCollection {
    /**
     * Find a follow by (followeeId, followerId) pair
     *
     * @param {string} followeeId  - The id of the user to follow
     * @param {string} followerId - the id of the user
     * @return {Promise<HydratedDocument<Follow>> | Promise<null>} - The follow with the given (followeeId, followerId) pair, if any
     */
    static async findOne(followeeId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        return FollowModel.findOne({ followee: followeeId, follower: followerId });
    }

    /**
     * Follows a user, Add a follow to the collection
     *
     * @param {string} followeeId - The id of the user to follow
     * @param {string} followerId - The id of the user
     * @return {Promise<HydratedDocument<Follow>>} - The newly created follow
     */
    static async follow(followeeId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        const date = new Date();

        const follow = new FollowModel({
            followee: followeeId,
            follower: followerId,
            dateCreated: date
        });
        await follow.save(); // Saves follow to MongoDB
        return (await follow.populate('followee')).populate('follower');
    }

    /**
     * Gets all the users that the user is following in the collection
     *
     * @param {string} userId - the id of the user
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all the users that the user is following
     */
    static async findAllFollowing(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
        return FollowModel.find({ follower: userId }).populate('followee').populate('follower');
    }

    /**
     * Gets all the users that are following the given user in the collection
     *
     * @param {string} userId - the id of the user
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all the users that follows the user
     */
    static async findAllFollowers(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
        return FollowModel.find({ followee: userId }).populate('followee').populate('follower');
    }

    /**
     * Unfollows a user, Delete a follow from the collection
     *
     * @param {string} followeeId - The id of the user to follow
     * @param {string} followerId - The id of the user
     * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
     */
    static async unfollow(followeeId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<boolean> {
        const result = await FollowModel.deleteOne({ followee: followeeId, follower: followerId });
        return result != null;
    }
}

export default FollowCollection;