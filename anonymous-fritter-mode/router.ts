import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import AnonymousModeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as anonymousModeValidator from '../anonymous-fritter-mode/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get whether user is in anonymous mode or not
 *
 * @name GET /api/anonymousMode/:username?
 *
 * @return {AnonymousModeResponse} - An anonymous mode object by user with username, username
 * @throws {403} - if the user is not logged in
 * @throws {400} - if username is not given
 * @throws {404} - if username is not a recognized username of any user
 *
 */
router.get(
    '/:username?',
    [
        userValidator.isUserLoggedIn,
        anonymousModeValidator.isAuthorExists
    ],
    async (req: Request, res: Response) => {
        const user = await UserCollection.findOneByUsername(req.params.username as string)
        const anonymousMode = await AnonymousModeCollection.findOne(user._id);
        res.status(200).json({
            message: 'You have sucessfully found the mode of the given user!',
            response: util.constructAnonymousModeResponse(anonymousMode)
        });
    }
);


/**
 * Switch an user into or out of anonymous mode
 *
 * @name PUT /api/anonymousMode/:username?
 *
 * @param {boolean} mode - a Boolean representing true if switching user into and false if switching out of anonymous mode
 * @return {AnonymousModeResponse} - the updated anonymous mode
 * @throws {403} - if the user is not logged in
 * @throws {400} - if username is not given
 * @throws {404} - if username is not a recognized username of any user
 */
router.put(
    '/:username?',
    [
        userValidator.isUserLoggedIn,
        anonymousModeValidator.isAuthorExists
    ],
    async (req: Request, res: Response) => {
        const mode = JSON.parse(req.body.mode as string)["mode"];
        const user = await UserCollection.findOneByUsername(req.params.username as string);
        const anonymousMode = await AnonymousModeCollection.updateOne(user._id, mode);
        res.status(200).json({
            message: 'You have sucessfully switched modes!',
            mode: util.constructAnonymousModeResponse(anonymousMode)
        });
    }
);

export { router as anonymousModeRouter }