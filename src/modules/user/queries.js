import cacheAdapter from '../../shared/adapters/cache.adapter.js';
import cacheKeysEnum from '../../shared/enums/cacheKeys.js';
import DataNotFoundException from '../../shared/exceptions/DataNotFoundException.js';
import userMapper from './mapper.js';
import userOperations from './operations.js';

const userQueries = {
  user: async (_, { id }) => {
    const cacheUserKey = `${cacheKeysEnum.USER}${id}`;
    const cachePlaylistsKey = `${cacheKeysEnum.PLAYLISTS}${id}`;
    const cacheSongsKey = `${cacheKeysEnum.SONGS}${id}`;

    const cachedUser = await cacheAdapter.get(cacheUserKey);

    if (cachedUser) {
      const cachedPlaylist = await cacheAdapter.get(cachePlaylistsKey);
      const cachedSongs = await cacheAdapter.get(cacheSongsKey);
      return await userMapper.mapToResponse(cachedUser, cachedPlaylist, cachedSongs);
    }

    const [user, playlists, songs] = await userOperations.getUserById(id, { withRelation: true });

    if (!user) throw new DataNotFoundException(`The user with id ${id}, not exists`);

    cacheAdapter.set(cacheUserKey, user);
    cacheAdapter.set(cachePlaylistsKey, playlists);
    cacheAdapter.set(cacheSongsKey, songs);

    return userMapper.mapToResponse(user, playlists, songs);
  },
};

export default userQueries;
