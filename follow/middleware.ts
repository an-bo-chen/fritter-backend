import { NextFunction, Request, Response } from "express";
import { Types } from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';

/**
 *  Checks if user already follows another user
 */
const isAlreadyFollow = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.username) {
        res.status(400).json({
          error: 'Provided username to follow must be nonempty.'
        });
        return;
    }
    
    const currentUser = await UserCollection.findOneByUserId(req.session.userId);
    const desiredUser = await UserCollection.findOneByUsername(req.body.username);

    if (!desiredUser) {
        res.status(404).json({
          error: `The user with username ${req.body.username as string} that you are trying to follow does not exist.`
        });
        return;
      }

    if (currentUser.username == desiredUser.username) {
        res.status(400).json({
            error: {
                username: 'You cannot follow yourself.'
            }
        });
        return;
    }

    const follow = await FollowCollection.findOne(desiredUser.id, currentUser.id);
    if (follow) {
        res.status(409).json({
            error: `You already follow a user with username ${desiredUser.username}.`
        });
        return;
    }

    next();
};

/**
 *  Checks if user already does not follow another user
 */
 const isAlreadyUnfollow = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.username) {
        res.status(400).json({
          error: 'Provided username to unfollow must be nonempty.'
        });
        return;
    }
    
    const currentUser = await UserCollection.findOneByUserId(req.session.userId);
    const desiredUser = await UserCollection.findOneByUsername(req.body.username);

    if (!desiredUser) {
        res.status(404).json({
          error: `The user with username ${req.body.username as string} that you are trying to unfollow does not exist.`
        });
        return;
      }

    if (currentUser.username == desiredUser.username) {
        res.status(400).json({
            error: {
                username: 'You cannot unfollow yourself.'
            }
        });
        return;
    }

    const follow = await FollowCollection.findOne(desiredUser.id, currentUser.id);
    if (!follow) {
        res.status(404).json({
            error: `You already do not follow a user with username ${desiredUser.username}.`
        });
        return;
    }

    next();
};


export {
    isAlreadyFollow,
    isAlreadyUnfollow
};