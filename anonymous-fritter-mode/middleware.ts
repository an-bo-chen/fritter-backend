import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import UserCollection from '../user/collection';

/**
 * Checks if a user with userId in req.params exists
 */
const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username as string;
    
    if (!username) {
      res.status(400).json({
        error: 'Provided username must be nonempty.'
      });
      return;
    }
  
    const user = await UserCollection.findOneByUsername(username);
    if (!user) {
      res.status(404).json({
        error: `A user with username ${username} does not exist.`
      });
      return;
    }
  
    next();
};

export {
    isAuthorExists
};