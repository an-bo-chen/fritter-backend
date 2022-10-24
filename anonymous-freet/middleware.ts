import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import AnonymousFreetCollection from '../anonymous-freet/collection';
import AnonymousUserCollection from '../anonymous-user/collection';

/**
 * Checks if an anonymous freet with anonymousFreetId is req.params exists
 */
const isAnonymousFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.anonymousFreetId);
  const anonymousFreet = validFormat ? await AnonymousFreetCollection.findOne(req.params.anonymousFreetId) : '';
  if (!anonymousFreet) {
    res.status(404).json({
      error: {
        freetNotFound: `Anonymous Freet with anonymous freet ID ${req.params.anonymousFreetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the anonyous freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidAnonymousFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body as { content: string };
  if (!content.trim()) {
    res.status(400).json({
      error: 'Anonymous Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Anonymous Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user has an anonymous user that is the author of the anonymous freet whose freetId is in req.params
 */
const isValidAnonymousFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const anonymousFreet = await AnonymousFreetCollection.findOne(req.params.anonymousFreetId);
  const anonymousAuthorId = anonymousFreet.anonymousAuthorId._id.toString();

  const userId = req.session.userId as string;
  const anonymousUserId = (await AnonymousUserCollection.findOneByPublicUserId(userId))._id.toString();

  if (anonymousUserId !== anonymousAuthorId) {
    res.status(403).json({
      error: 'Cannot modify other users\' anonymous freets.'
    });
    return;
  }

  next();
};

export {
  isValidAnonymousFreetContent,
  isAnonymousFreetExists,
  isValidAnonymousFreetModifier
};