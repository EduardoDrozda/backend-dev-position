import knex from '../../../database/knex.js';
import databaseAdapter from '../../shared/adapters/database.adapter.js';

const findUserById = async (id, { withRelation }) => {
  const userQuery = databaseAdapter.table('users').where({ id }).first();

  if (!withRelation) return Promise.all([userQuery]);

  const playlistQuery = databaseAdapter
    .table('playlists')
    .select('playlists.*', 'songs.id as songs_id', 'songs.name as songs_name')
    .leftJoin('playlist_songs', 'playlist_songs.playlist_id', 'playlists.id')
    .leftJoin('songs', 'playlist_songs.song_id', 'songs.id')
    .where('playlists.user_id', id)
    .orderBy('playlists.name');

  const songsQuery = databaseAdapter.table('songs').where({ user_id: id }).orderBy('name');

  return await Promise.all([userQuery, playlistQuery, songsQuery]);
};

const userOperations = {
  getUserById: async (id, options = {}) => {
    return await findUserById(id, options);
  },
  getUserByEmail: async (email) => {
    return await databaseAdapter
      .table('users')
      .whereRaw('LOWER(email) = ?', email.toLowerCase())
      .first();
  },
  createUser: async (name, email) => {
    const [newUser] = await databaseAdapter.table('users').returning('*').insert({ name, email });
    return newUser;
  },
  updateUser: async (id, name, email) => {
    return await databaseAdapter
      .table('users')
      .returning('*')
      .where({ id })
      .update({ name, email });
  },
};

export default userOperations;
