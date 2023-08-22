export function up(knex) {
  return knex.schema.alterTable('playlists', function (table) {
    table.dropForeign('user_id'); 
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
}

export function down(knex) {
  return knex.schema.alterTable('playlists', function(table) {
    table.dropForeign('user_id');
    table.uuid('user_id').references('users.id');
  });
}
