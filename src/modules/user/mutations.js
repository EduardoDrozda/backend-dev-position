import cacheAdapter from '../../shared/adapters/cache.adapter.js';
import cacheKeysEnum from '../../shared/enums/cacheKeys.js';
import DataAlreadyExistsException from '../../shared/exceptions/DataAlreadyExistsException.js';
import DataNotFoundException from '../../shared/exceptions/DataNotFoundException.js';
import userMapper from './mapper.js';
import userOperations from './operations.js';

const validateIfUserEmailAlreadyExists = async (email) => {
  const user = await getUserByEmail(email);

  if (user) {
    throw new DataAlreadyExistsException(`Email '${email}' already exists.`);
  }
};

const validateIfUserExists = async (email) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new DataNotFoundException(`The user with email '${email}' not exists.`);
  }

  return user;
};

const getUserByEmail = async (email) => {
  return await userOperations.getUserByEmail(email);
};

const invalidateUserCache = (id) => {
  const cacheUserKey = `${cacheKeysEnum.USER}${id}`;
  const cachePlaylistsKey = `${cacheKeysEnum.PLAYLISTS}${id}`;
  const cacheSongsKey = `${cacheKeysEnum.SONGS}${id}`;

  cacheAdapter.delete(cacheUserKey);
  cacheAdapter.delete(cachePlaylistsKey);
  cacheAdapter.delete(cacheSongsKey);
};

const userMutations = {
  createUser: async (_, { name, email }) => {
    await validateIfUserEmailAlreadyExists(email);
    return await userOperations.createUser(name, email);
  },
  updateUser: async (_, { name, email }) => {
    const user = await validateIfUserExists(email);

    await userOperations.updateUser(user.id, name, email);

    const [findedUser, playlists, songs] = await userOperations.getUserById(user.id, {
      withRelation: true,
    });

    invalidateUserCache(user.id);

    return userMapper.mapToResponse(findedUser, playlists, songs);
  },
};

export default userMutations;
