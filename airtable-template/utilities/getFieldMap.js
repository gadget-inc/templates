import { logger } from "gadget-server"

export default async () => {
  const tableInfo = await fetch(`https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
    },
  })

  const tableInfoData = await tableInfo.json()
  const fieldMap = {}

  logger.info({ tableInfoData })

  for (const field of tableInfoData[0].fields) {
    console.log(field.name)
    fieldMap[field.id] = field.name
  }

  return fieldMap;
}
