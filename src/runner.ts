import { Worker } from 'bullmq';
const connection = require('../connection/connection');

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getCredentials } = require('./auth');

const docId = process.env.GOOGLE_SPREADSHEET_ID;
const doc = new GoogleSpreadsheet(docId);
const creds = getCredentials();

const spreadsheet = async () => {
    try {
        await doc.useServiceAccountAuth(creds);

        await doc.loadInfo();
    } catch (e) {
        throw new Error(e);
    }
};

spreadsheet();

// const queueName = 'foo';

// const worker = new Worker(
//     queueName,
//     async (job) => {
//         // Will print { foo: 'bar'} for the first job
//         // and { qux: 'baz' } for the second.
//         console.log(job.data);
//     },
//     connection,
// );
