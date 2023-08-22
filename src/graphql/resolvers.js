import playlistMutations from '../modules/playlist/mutations.js';
import playlistQueries from '../modules/playlist/queries.js';
import songsMutations from '../modules/songs/mutations.js';
import songsQueries from '../modules/songs/queries.js';
import userMutations from '../modules/user/mutations.js';
import userQueries from '../modules/user/queries.js';

const resolvers = {
  Query: {
    ...userQueries,
    ...songsQueries,
    ...playlistQueries,
  },
  Mutation: {
    ...userMutations,
    ...songsMutations,
    ...playlistMutations,
  },
};

export default resolvers;
