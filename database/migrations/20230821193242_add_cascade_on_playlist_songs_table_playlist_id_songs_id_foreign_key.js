export function up(knex) {
  return knex.schema.alterTable('playlist_songs', function (table) {
    table.dropForeign('playlist_id'); 
    table.foreign('playlist_id').references('playlists.id').onDelete('CASCADE');

    table.dropForeign('song_id'); 
    table.foreign('song_id').references('songs.id').onDelete('CASCADE');
  });
}

export function down(knex) {
  return knex.schema.alterTable('playlist_songs', function(table) {
    table.dropForeign('playlist_id');
    table.uuid('playlist_id').references('playlists.id');

    table.dropForeign('song_id'); 
    table.foreign('song_id').references('songs.id');
  });
}
