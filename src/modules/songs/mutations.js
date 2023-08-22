import cacheAdapter from '../../shared/adapters/cache.adapter.js';
import cacheKeysEnum from '../../shared/enums/cacheKeys.js';
import playlistOperations from '../playlist/operations.js';
import songsOperations from './operations.js';

const cacheSongs = async (userId) => {
  const songs = await songsOperations.getSongsByUserId(userId);
  const playlists = await playlistOperations.getPlaylistsByUserId(userId);

  const cacheSongsKey = `${cacheKeysEnum.SONGS}${userId}`;
  const cachePlaylistsKey = `${cacheKeysEnum.PLAYLISTS}${userId}`;
  cacheAdapter.set(cacheSongsKey, songs);
  cacheAdapter.set(cachePlaylistsKey, playlists);
};

const songsMutations = {
  createSong: async (_, { userId, name }) => {
    const result = await songsOperations.createSong(userId, name);
    await cacheSongs(userId);
    return result;
  },
  deleteSong: async (_, { id, userId }) => {
    const result = await songsOperations.deleteSong(id, userId);
    await cacheSongs(userId);
    return result;
  },
};

export default songsMutations;
