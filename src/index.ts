import { Queue } from 'bullmq';
const connection = require('../connection/connection');

// Create a new connection in every instance
const myQueue = new Queue('foo', connection);

async function addJobs() {
    await myQueue.add('myJobName', { foo: 'bar' });
    await myQueue.add('myJobName', { qux: 'baz' });
}

addJobs();
