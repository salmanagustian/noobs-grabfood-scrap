export interface IRedisConnection {
    connection: Connection;
}

type Connection = { host: string; port: number };
