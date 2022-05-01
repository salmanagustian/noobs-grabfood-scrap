import { Job, Worker } from 'bullmq';
import { IListMerchant } from '../interfaces/merchant.interface';
const queueName = 'merchants-grabfood';
const connection = require('../connection/connection');

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getCredentials } = require('./auth');

const docId = process.env.GOOGLE_SPREADSHEET_ID;
const doc = new GoogleSpreadsheet(docId);
const creds = getCredentials();

const main = async (): Promise<any> => {
  try {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    // handle googlespreadsheet
    const sheet = doc.sheetsByIndex[0];

    // handle worker
    const worker = new Worker(
      queueName,
      (job: Job) => {
        const dataJobMerchants = job.data;

        return dataJobMerchants;
      },
      connection,
    );

    worker.on('completed', async (job: Job, returnResult: any) => {
      const dataMerchant = returnResult;

      const data: IListMerchant = {
        ID: dataMerchant?.id,
        Name: dataMerchant?.address?.name,
        Cuisine: dataMerchant?.merchantData?.cuisine,
        Rating: dataMerchant?.rating ? dataMerchant?.rating : 'Dont have any rating',
        Promo: dataMerchant?.promo?.description ? dataMerchant?.promo?.description : 'Dont have any description',
      };

      await new Promise(() => {
        sheet.addRow(data, () => console.log(`Adding merchant ${dataMerchant.address.name} to Google SpreadSheet!`));
      });
    });
  } catch (e) {
    throw new Error(e);
  }
};

main();
