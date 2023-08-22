import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { readFileSync } from 'fs';

import knex from 'knex';
import knexConfig from './knexfile.js';

import resolvers from './src/graphql/resolvers.js';
import typeDefs from './src/graphql/typedefs.js';

import enviroment from './src/config/enviroment.js';

import './src/bootstrap.js';

export const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const configApplication = async () => {
  const { nodeEnv } = enviroment;

  await server.start();

  const db = knex(knexConfig[nodeEnv]);
  db.migrate.latest();

  server.applyMiddleware({ app });
};

async function startServer() {
  await configApplication();

  const { port } = enviroment;
  app.listen(port, () => {
    console.log(` 🚀 http://localhost:${port}/graphql`);
  });
}

startServer();
