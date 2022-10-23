import type { NextFunction, Request, Response } from "express";
import express from 'express';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';
import { constructFreetResponse } from '../freet/util';

const router = express.Router();

/**
 * Get all the users that the user follows
 *
 * @name GET /api/follows/following
 *
 * @return {FollowResponse[]} - A list of all users by their ids that the user follows
 * @throws {403} if the user is not logged in
 */
 router.get(
    '/following',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const user = await UserCollection.findOneByUserId(req.session.userId);
        const following = await FollowCollection.findAllFollowing(user._id);
        const response = following.map(util.constructFollowResponse);
        
        res.status(200).json({
            message: 'Look at all your followings!',
            following: response
        });
    }
);

/**
 * Get all freets from the users that the user follows
 *
 * @name GET /api/follows/following/freets
 *
 * @return {FollowResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 * @throws {403} if the user is not logged in
 */
 router.get(
    '/following/freets',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const user = await UserCollection.findOneByUserId(req.session.userId);
        const following = await FollowCollection.findAllFollowing(user._id);
        const response = (await Promise.all(following.map(async (follow) => {
            const user = await UserCollection.findOneByUserId(follow.followee);
            return await FreetCollection.findAllByUsername(user.username);
        })))
        .flat()
        .sort((freet1, freet2) => {
            return freet2.dateModified.getTime() - freet1.dateModified.getTime();
        })
        .map(constructFreetResponse);
        
        res.status(200).json({
            message: 'Look at your home feed!',
            feed: response
        });
    }
);

/**
 * Get all the users that follows the user
 *
 * @name GET /api/follows/follower
 *
 * @return {FollowResponse[]} - A list of all users by their ids that follows the user
 * @throws {403} if the user is not logged in
 */
 router.get(
    '/followers',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const user = await UserCollection.findOneByUserId(req.session.userId);
        const followers = await FollowCollection.findAllFollowers(user._id);
        const response = followers.map(util.constructFollowResponse);

        res.status(200).json({
            message: 'Look at all your followers!',
            followers: response
        });
    }
);

/**
 * Create a new follow between current user and desired user
 *
 * @name POST /api/follows
 *
 * @return {FollowResponse} - The created freet
 * @throws {400} if desired user is the current user
 * @throws {403} if the current user is not logged in
 * @throws {404} if desired user's username is not a recognized username of any user
 * @throws {409} if current user already follows desired user
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        followValidator.isAlreadyFollow
    ],
    async (req: Request, res: Response) => {
        const username = req.body.username as string;
        const followeeId = (await UserCollection.findOneByUsername(username))._id;
        const followerId = req.session.userId as string;
        
        const follow = await FollowCollection.follow(followeeId, followerId);
        const response = util.constructFollowResponse(follow);

        res.status(201).json({
            message: `You are now following ${username}!`,
            follow: response
        });
    }
);

/**
 * Delete a new follow between current user and desired user
 *
 * @name DELETE /api/follows
 *
 * @return {string} - A success message
 * @throws {400} if desired user is the current user
 * @throws {403} if the current user is not logged in
 * @throws {404} if desired user's username is not a recognized username of any user
 * @throws {404} if current user already does nt follow desired user
 */
router.delete(
    '/:username',
    [
        userValidator.isUserLoggedIn,
        followValidator.isAlreadyUnfollow
    ],
    async (req: Request, res: Response) => {
        const username = req.params.username as string;
        const followeeId = (await UserCollection.findOneByUsername(username))._id;
        const followerId = req.session.userId as string;
        
        await FollowCollection.unfollow(followeeId, followerId);

        res.status(201).json({
            message: `You have unfollowed ${username}!`,
        });
    }
);

export {router as followRouter};
