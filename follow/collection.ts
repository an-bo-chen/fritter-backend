import type { HydratedDocument, Types } from 'mongoose';
import type { Follow } from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

class FollowCollection {
    /**
     * Find a follow by (toBeFollowedId, followerId) pair
     *
     * @param {string} toBeFollowedId  - The id of the user to follow
     * @param {string} followerId - the id of the user
     * @return {Promise<HydratedDocument<Follow>> | Promise<null>} - The follow with the given (toBeFollowedId, followerId) pair, if any
     */
    static async findOne(toBeFollowedId : Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {        
        return FollowModel.findOne({toBeFollowed: toBeFollowedId, follower: followerId});
    }
    
    /**
     * Follows a user, Add a follow to the collection
     *
     * @param {string} toBeFollowedId - The id of the user to follow
     * @param {string} followerId - The id of the user
     * @return {Promise<HydratedDocument<Follow>>} - The newly created follow
     */
    static async follow(toBeFollowedId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        const date = new Date();

        const follow = new FollowModel({
            toBeFollowed: toBeFollowedId,
            follower: followerId,
            dateCreated: date
        });
        await follow.save(); // Saves follow to MongoDB
        return (await follow.populate('toBeFollowed')).populate('follower');
    }

    /**
     * Gets all the users that the user is following in the collection
     *
     * @param {string} userId - the id of the user
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all the users that the user is following
     */
    static async findAllFollowing(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
        return FollowModel.find({follower: userId}).populate('toBeFollowed').populate('follower');
    }

    /**
     * Gets all the users that are following the given user in the collection
     *
     * @param {string} userId - the id of the user
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all the users that follows the user
     */
    static async findAllFollowers(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
        return FollowModel.find({toBeFollowed: userId}).populate('toBeFollowed').populate('follower');
    }

    /**
     * Unfollows a user, Delete a follow from the collection
     *
     * @param {string} toBeFollowedId - The id of the user to follow
     * @param {string} followerId - The id of the user
     * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
     */
     static async unfollow(toBeFollowedId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<boolean> {        
        const result = await FollowModel.deleteOne({toBeFollowed: toBeFollowedId, follower: followerId});
        return result != null;
    }
}

export default FollowCollection;