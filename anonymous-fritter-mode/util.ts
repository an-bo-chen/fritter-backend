import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { AnonymousMode, PopulatedAnonymousMode } from '../anonymous-fritter-mode/model';

type AnonymousModeResponse = {
  _id: string;
  username: string,
  isAnonymousMode: boolean
};

/**
 * Transform a raw Anonymous Mode object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<AnonymousMode>} anonymousMode - An anonymous mode
 * @returns {AnonymousModeResponse} - The anonymous mode object formatted for the frontend
 */
const constructAnonymousModeResponse = (anonymousMode: HydratedDocument<AnonymousMode>): AnonymousModeResponse => {
  const anonymousModeCopy: PopulatedAnonymousMode = {
    ...anonymousMode.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const { username } = anonymousModeCopy.userId
  delete anonymousModeCopy.userId;
  return {
    ...anonymousModeCopy,
    _id: anonymousModeCopy._id.toString(),
    username: username
  };
};

export {
  constructAnonymousModeResponse
};
