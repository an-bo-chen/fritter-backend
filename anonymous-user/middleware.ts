import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import AnonymousUserCollection from '../anonymous-user/collection';

/**
 * Checks if an anonymous user with anonymousUserId as author id in req.query exists
 */
const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  const anonymousUserId = req.query.authorId as string;
  if (!anonymousUserId) {
    res.status(400).json({
      error: 'Provided author id must be nonempty.'
    });
    return;
  }
  const anonymousUser = await AnonymousUserCollection.findOneByAnonymousUserId(anonymousUserId);

  if (!anonymousUser) {
    res.status(404).json({
      error: `An anonymous user with id ${anonymousUserId} does not exist.`
    });
    return;
  }

  next();
};

export {
  isAuthorExists
};