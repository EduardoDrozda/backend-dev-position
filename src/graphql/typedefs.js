import { readFileSync } from 'fs';
import path from 'path';

const typeDefs = readFileSync(path.resolve('src', 'graphql', 'schema.graphql'), 'utf8');

export default typeDefs;
