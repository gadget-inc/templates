const { CloudTasksClient } = require('@google-cloud/tasks');

export const client = new CloudTasksClient({
  credentials: {
    client_email: process.env.GCLOUD_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GCLOUD_SERVICE_ACCOUNT_PRIVATE_KEY
      .split(String.raw`\n`)
      .join("\n"),
  },
});

export const parent = client.queuePath(process.env.GCLOUD_PROJECT_ID, process.env.GCLOUD_LOCATION_ID, process.env.GCLOUD_QUEUE_ID);