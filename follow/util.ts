import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Follow, PopulatedFollow } from '../follow/model';

type FollowResponse = {
    _id: string;
    followee: string;
    follower: string;
    dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Follow object from the database into an object with all the
 * information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the front end
 */
 const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
    const followCopy: PopulatedFollow = {
      ...follow.toObject({
        versionKey: false
      })
    };
    
    return {
      _id: followCopy._id.toString(),
      followee: followCopy.followee.username,
      follower: followCopy.follower.username,
      dateCreated: formatDate(follow.dateCreated)
    };
  };

export {
    constructFollowResponse
};