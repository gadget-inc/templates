const Airtable = require('airtable');

// Connecting to the project that houses the table to create a record on
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);

// Specifying the table to add to in Airtable
export default base(process.env.AIRTABLE_PRODUCT_TABLE_ID);
