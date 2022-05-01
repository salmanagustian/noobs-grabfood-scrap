import { IRedisConnection } from '../interfaces/connection.interface';

const redisConnection: IRedisConnection = {
    connection: {
        host: 'localhost',
        port: 6379,
    },
};

module.exports = redisConnection;
