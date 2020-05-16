import * as redis from 'redis'
import config from '../config'
import LoggerInstance from './logger'
import * as bluebird from 'bluebird'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const redisClient = redis.createClient(config.redisURL)

redisClient.on('error', err => {
  LoggerInstance.log('Redis error: ', err)
})

export default redisClient
