import knex from '../../../database/knex.js';

const findPlaylistById = async (id, { withRelation } = {}) => {
  if (!withRelation) return await knex('playlists').where({ id }).first();

  return await knex('playlists')
    .select('playlists.*', 'songs.id as songs_id', 'songs.name as songs_name')
    .leftJoin('playlist_songs', 'playlist_songs.playlist_id', 'playlists.id')
    .leftJoin('songs', 'playlist_songs.song_id', 'songs.id')
    .where('playlists.id', id);
};

const findPlaylistsByUserId = async (userId) => {
  return await knex('playlists')
    .select('playlists.*', 'songs.id as songs_id', 'songs.name as songs_name')
    .leftJoin('playlist_songs', 'playlist_songs.playlist_id', 'playlists.id')
    .leftJoin('songs', 'playlist_songs.song_id', 'songs.id')
    .where('playlists.user_id', userId)
    .orderBy('playlists.name');
};

const playlistOperations = {
  getPlaylistsByUserId: async (userId) => {
    return await findPlaylistsByUserId(userId);
  },
  createPlaylist: async (userId, name) => {
    const [newPlaylist] = await knex('playlists').returning('*').insert({ user_id: userId, name });
    return newPlaylist;
  },
  getPlaylistById: async (id, { withRelation } = {}) => {
    return await findPlaylistById(id, { withRelation });
  },
  deletePlaylist: async (id, userId) => {
    const result = await knex('playlists').where({ id, user_id: userId }).delete();
    return !!result;
  },
  addSongToPlaylist: async (songId, playlistId) => {
    await knex('playlist_songs')
      .returning('*')
      .insert({ song_id: songId, playlist_id: playlistId });
  },
  removeSongFromPlaylist: async (songId, playlistId) => {
    await knex('playlist_songs').where({ song_id: songId, playlist_id: playlistId }).delete();
  },
};

export default playlistOperations;
