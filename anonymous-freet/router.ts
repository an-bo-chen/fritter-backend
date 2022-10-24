import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import AnonymousFreetCollection from './collection';
import AnonymousUserCollection from '../anonymous-user/collection';
import * as userValidator from '../user/middleware';
import * as anonymousUserValidator from '../anonymous-user/middleware';
import * as anonymousFreetValidator from '../anonymous-freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the anonymous freets
 *
 * @name GET /api/anonymousFreets
 *
 * @return {AnonymousFreetResponse[]} - A list of all the anonyous freets sorted in descending
 *                      order by date modified
 */
/**
 * Get anonymous freets by anonymous author.
 *
 * @name GET /api/anonymousFreets?authorId=id
 *
 * @return {AnonymousFreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.authorId !== undefined) {
      next();
      return;
    }

    const allAnonymousFreets = await AnonymousFreetCollection.findAll();
    const response = allAnonymousFreets.map(util.constructAnonymousFreetResponse);
    res.status(200).json(response);
  },
  [
    anonymousUserValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const anonymousAuthorFreets = await AnonymousFreetCollection.findAllByAnonymousUserId(req.query.authorId as string);

    const response = anonymousAuthorFreets.map(util.constructAnonymousFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new anonymous freet.
 *
 * @name POST /api/anonymousFreets
 *
 * @param {string} content - The content of the anonymous freet
 * @return {AnonymousFreetResponse} - The created anonymous freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the anonymous freet content is empty or a stream of empty spaces
 * @throws {413} - If the anonymous freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    anonymousFreetValidator.isValidAnonymousFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const anonymousUserId = (await AnonymousUserCollection.findOneByPublicUserId(userId))._id;
    const anonymousFreet = await AnonymousFreetCollection.addOne(anonymousUserId, req.body.content);

    res.status(201).json({
      message: 'Your anonymous freet was created successfully.',
      freet: util.constructAnonymousFreetResponse(anonymousFreet)
    });
  }
);

/**
 * Delete an anonymous freet
 *
 * @name DELETE /api/anonymousFreets/:anonymousFreetId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the anonymous freet
 * @throws {404} - If the anonymousFreetId is not valid
 */
router.delete(
  '/:anonymousFreetId?',
  [
    userValidator.isUserLoggedIn,
    anonymousFreetValidator.isAnonymousFreetExists,
    anonymousFreetValidator.isValidAnonymousFreetModifier
  ],
  async (req: Request, res: Response) => {
    await AnonymousFreetCollection.deleteOne(req.params.anonymousFreetId);
    res.status(200).json({
      message: 'Your anonymous freet was deleted successfully.'
    });
  }
);

/**
 * Modify an anonymous freet
 *
 * @name PUT /api/anonymousFreets/:anonymousFreetId
 *
 * @param {string} content - the new content for the anonymous freet
 * @return {AnonymousFreetResponse} - the updated anonymous freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the anonymous freet
 * @throws {404} - If the anonymousFreetId is not valid
 * @throws {400} - If the anonymous freet content is empty or a stream of empty spaces
 * @throws {413} - If the anonymous freet content is more than 140 characters long
 */
router.put(
  '/:anonymousFreetId?',
  [
    userValidator.isUserLoggedIn,
    anonymousFreetValidator.isAnonymousFreetExists,
    anonymousFreetValidator.isValidAnonymousFreetModifier,
    anonymousFreetValidator.isValidAnonymousFreetContent
  ],
  async (req: Request, res: Response) => {
    const anonymousFreet = await AnonymousFreetCollection.updateOne(req.params.anonymousFreetId, req.body.content);
    res.status(200).json({
      message: 'Your anonymous freet was updated successfully.',
      freet: util.constructAnonymousFreetResponse(anonymousFreet)
    });
  }
);

export { router as anonymousFreetRouter };
