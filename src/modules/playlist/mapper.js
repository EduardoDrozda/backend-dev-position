const playlistMapper = {
  mapToResponse: (playlists) => {
    const resultMap = new Map();

    playlists.forEach(({ id, name, songs_id, songs_name, user_id }) => {
      let playlist = resultMap.get(id);

      if (!playlist) {
        playlist = {
          id,
          name,
          userId: user_id,
          songs: [],
        };

        resultMap.set(id, playlist);
      }

      if (songs_id) {
        playlist.songs.push({
          id: songs_id,
          name: songs_name,
        });
      }
    });

    return Array.from(resultMap.values());
  },
};

export default playlistMapper;
