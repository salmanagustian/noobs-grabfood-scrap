import * as fs from 'fs';
import { ICredentials } from '../interfaces/creds.interface';

require('dotenv').config();

const getCredentials = (): ICredentials => {
    const credsFileName = process.env.CREDS_FILE_NAME;
    const credsPath = process.env.CREDS_PATH;
    const creds = `${credsPath}/${credsFileName}`;

    if (!fs.existsSync(creds)) {
        throw new Error('File secret not found..');
    }

    const credsString = JSON.parse(fs.readFileSync(creds).toString('utf-8'));

    return { client_email: credsString.client_email, private_key: credsString.private_key };
};

module.exports = { getCredentials };
