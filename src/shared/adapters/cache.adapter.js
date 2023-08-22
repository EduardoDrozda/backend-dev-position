import redis from 'redis';
import enviroment from '../../config/enviroment.js';

const client = redis.createClient({
  url: enviroment.redisUrl,
});

client.connect();

const cacheAdapter = {
  set: async (key, value) => {
    await client.set(key, JSON.stringify(value));
  },
  get: async (key) => {
    const result = await client.get(key);

    if (result) {
      return JSON.parse(result);
    }

    return null;
  },
  delete: async (key) => {
    client.del(key);
  },
};

export default cacheAdapter;
