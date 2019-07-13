import * as redis from 'redis';
import config from '../config';

const redisClient = redis.createClient(config.redisURL);

redisClient.on('error', err => {
  console.log('Redis error: ', err);
});

export default redisClient;
