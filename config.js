module.exports = {
  host: '0.0.0.0'
, port: '8001'
, redis: process.env.REDIS_URL || 'redis://localhost:6379'
}
