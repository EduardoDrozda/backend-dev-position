import playlistMapper from './mapper.js';
import playlistOperations from './operations.js';

const playlistQueries = {
  playlists: async (_, { userId }) => {
    const result = await playlistOperations.getPlaylistsByUserId(userId);
    if (!result.length) return [];
    return playlistMapper.mapToResponse(result);
  },
};

export default playlistQueries;
