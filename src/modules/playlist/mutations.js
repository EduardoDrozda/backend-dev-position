import cacheAdapter from '../../shared/adapters/cache.adapter.js';
import cacheKeysEnum from '../../shared/enums/cacheKeys.js';
import DataNotFoundException from '../../shared/exceptions/DataNotFoundException.js';
import userOperations from '../user/operations.js';
import playlistMapper from './mapper.js';
import playlistOperations from './operations.js';

const getPlaylistById = async (id, options = {}) => {
  return await playlistOperations.getPlaylistById(id, options);
};

const checkIfUserExists = async (userId) => {
  const user = await userOperations.getUserById(userId, { withRelation: false });
  if (!user) throw new DataNotFoundException(`The user with id ${userId} not exists.`);
};

const buildPlaylistsToResponse = async (playlistId) => {
  const result = await getPlaylistById(playlistId, { withRelation: true });
  const [mappedPlaylist] = playlistMapper.mapToResponse(result);

  await cachePlaylistByUserId(mappedPlaylist.userId);
  return mappedPlaylist;
};

const cachePlaylistByUserId = async (userId) => {
  const result = await playlistOperations.getPlaylistsByUserId(userId);

  const cachePlaylistsKey = `${cacheKeysEnum.PLAYLISTS}${userId}`;
  await cacheAdapter.set(cachePlaylistsKey, result);
};

const playlistMutations = {
  createPlaylist: async (_, { userId, name }) => {
    await checkIfUserExists(userId);

    const newPlaylist = await playlistOperations.createPlaylist(userId, name);
    const [result] = playlistMapper.mapToResponse([newPlaylist]);

    await cachePlaylistByUserId(userId);
    return result;
  },
  deletePlaylist: async (_, { id, userId }) => {
    const result = await playlistOperations.deletePlaylist(id, userId);

    if (result) {
      await cachePlaylistByUserId(userId);
    }

    return result;
  },
  addSongToPlaylist: async (_, { songId, playlistId }) => {
    await playlistOperations.addSongToPlaylist(songId, playlistId);
    return await buildPlaylistsToResponse(playlistId);
  },
  removeSongFromPlaylist: async (_, { songId, playlistId }) => {
    await playlistOperations.removeSongFromPlaylist(songId, playlistId);
    return await buildPlaylistsToResponse(playlistId);
  },
};

export default playlistMutations;
