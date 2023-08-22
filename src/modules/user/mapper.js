import playlistMapper from '../playlist/mapper.js';

const userMapper = {
  mapToResponse: (user, playlist, songs) => {
    const userMapped = {
      ...user,
      playlists: playlist ? playlistMapper.mapToResponse(playlist) : [],
      songs,
    };

    return userMapped;
  },
};

export default userMapper;
