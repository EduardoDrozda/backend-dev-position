import databaseAdapter from '../../shared/adapters/database.adapter.js';

const songsOperations = {
  getSongsByUserId: async (userId) => {
    return await databaseAdapter.table('songs').where({ user_id: userId }).orderBy('name');
  },
  getSongById: async (id) => {
    return await databaseAdapter.table('songs').where({ id }).first();
  },
  createSong: async (userId, name) => {
    const [newSong] = await databaseAdapter
      .table('songs')
      .returning('*')
      .insert({ user_id: userId, name });
    return newSong;
  },
  deleteSong: async (id, userId) => {
    const result = await databaseAdapter.table('songs').where({ id, user_id: userId }).delete();
    return !!result;
  },
};

export default songsOperations;
