import type { HydratedDocument, Types } from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from 'user/collection';

/**
 * This files contains a class that has the functionality to explore follows
 * stored in MongoDB, including adding, finding, updating, and deleting follows.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Follow. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {

}

export default FollowCollection;