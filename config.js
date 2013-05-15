module.exports = {
  host: '0.0.0.0'
, port: '8001'

, redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379/0'
}
