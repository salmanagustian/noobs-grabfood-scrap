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
    // handle worker
    const worker = new Worker(
      queueName,
      async (job: Job) => {
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();
        const dataJobMerchants = job.data;

        return dataJobMerchants;
      },
      connection,
    );

    worker.on('completed', async (job: Job, returnResult: any) => {
      // handle googlespreadsheet
      const sheet = doc.sheetsByIndex[0];
      const dataMerchant = returnResult;

      const data: IListMerchant = {
        ID: dataMerchant?.id,
        Name: dataMerchant?.address?.name,
        Cuisine: dataMerchant?.merchantData?.cuisine,
        Rating: dataMerchant?.merchantData?.rating ? dataMerchant.merchantData.rating : 'Dont have any rating',
        Promo: dataMerchant?.merchantData?.promo?.description
          ? dataMerchant.merchantData.promo.description
          : 'Dont have any description',
      };

      console.log(`Adding merchant ${dataMerchant.address.name} to Google SpreadSheet!`);
      await sheet.addRow(data);
    });
  } catch (e) {
    throw new Error(e);
  }
};

main();
