import knex from '../../../database/knex.js';

const databaseAdapter = {
  table: knex,
};

export default databaseAdapter;
