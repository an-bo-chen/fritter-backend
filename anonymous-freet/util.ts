import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { AnonymousFreet } from '../anonymous-freet/model';

type AnonymousFreetResponse = {
  _id: string;
  anonymousAuthorId: string,
  dateCreated: string;
  content: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Anonymous Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<AnonymousFreet>} anonymousFreet - An anonymous freet
 * @returns {AnonymousFreetResponse} - The anonymous freet object formatted for the frontend
 */
const constructAnonymousFreetResponse = (anonymousFreet: HydratedDocument<AnonymousFreet>): AnonymousFreetResponse => {
  const anonymousFreetCopy: AnonymousFreet = {
    ...anonymousFreet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...anonymousFreetCopy,
    _id: anonymousFreetCopy._id.toString(),
    anonymousAuthorId: anonymousFreetCopy.anonymousAuthorId._id.toString(),
    dateCreated: formatDate(anonymousFreet.dateCreated),
    dateModified: formatDate(anonymousFreet.dateModified)
  };
};

export {
  constructAnonymousFreetResponse
};
