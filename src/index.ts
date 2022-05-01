import { Queue } from 'bullmq';
import axios from 'axios';
const connection = require('../connection/connection');

// Create a new connection in every instance
const myQueue = new Queue('merchants-grabfood', connection);

async function addJobs() {
  try {
    const {
      data: { recommendedMerchantGroups },
    } = await axios.get(
      'https://portal.grab.com/foodweb/v2/recommended/merchants?latitude=-6.87061&longitude=107.55486&mode=&offset=0&countryCode=IDntryCode=ID',
    );

    const recommendMerchants = recommendedMerchantGroups[0]['recommendedMerchants'];

    for (let i = 0; i < recommendMerchants.length; i++) {
      const merchants = recommendMerchants[i];

      console.log(`Adding merchants ${merchants.id} to queue`);
      await myQueue.add('get-recomended-merchants', merchants);
    }
  } catch (err) {
    throw new Error(err);
  }
}

addJobs();
