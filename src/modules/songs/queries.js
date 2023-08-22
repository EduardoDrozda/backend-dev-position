import songsOperations from './operations.js';

const songsQueries = {
  songs: async (_, { userId }) => {
    return await songsOperations.getSongsByUserId(userId);
  },
};

export default songsQueries;
