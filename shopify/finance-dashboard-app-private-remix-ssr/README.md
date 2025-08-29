# Shopify → Notion template set up guide

This guide walks you through setting up an automated bridge: Shopify → Gadget → Notion.

New Shopify orders flow into Notion, updating your finance dashboard with sales, costs, and margins in real time.

<a href="https://gadget.wistia.com/medias/zo7raw6wfb">
  <p style="font-weight: bold; font-size: 18px;">Shopify to Notion bridge template walkthrough</p>
  <p>Watch this video walkthrough guide to set up this template</p>
</a>

### Requirements

- Shopify Partner account with access to a development store
- Connect your Gadget app to Shopify
- A Notion workspace with a copy of the prebuilt [finance dashboard](https://steampunk-education.notion.site/Finance-Dashboard-249719c13e368029a77be68a7b824e35).

### Part 1: Connect Shopify to Gadget

#### 1.1 Initial Shopify Connection

1. In Gadget, navigate to **Settings** (bottom left corner)
2. Go to **Plugins**
3. Select the **Shopify connection** (it will show as "incomplete")
4. Click **Connect to Shopify App**
5. Log into your Shopify Partner organization if prompted
6. Click **Continue** twice

#### 1.2 Handle Protected Customer Data Access

1. When prompted about accessing customer data, click **Open the access form**
2. In the form, indicate you're using the data only to make the app run
3. Save the form
4. Return to Gadget and confirm you've filled out the form
5. Click **Request access**

#### 1.3 Install the App

1. Review the permissions (personal and store information access)
2. Click **Install**
3. The Gadget landing page will load

Since Gadget is acting as middleware, we have no need to customize this landing page, or any part of the frontend. If you want to customize this template and add a frontend that users can see from their Shopify admin, go to the `web` folder and edit the React code there.

#### 1.4 Sync Shopify Data

1. Click on **Installs** on the far left side of the Gadget UI:
2. Click **Sync** to import all product data into Gadget's database
3. Wait for sync completion (usually takes a minute)

#### 1.5 Set Product Costs

**Important**: You must set product costs in Shopify for margin calculations to work.

1. In Shopify admin, go to **Products**
2. For each product:
   - Edit the product
   - Set the cost (e.g., $500)
   - Save
3. Verify in Gadget:
   - Go to `api` → `models` → `shopifyInventoryItem` → `data`
   - Refresh to see the updated costs

### Part 2: Connect Gadget to Notion

#### 2.1 Create Notion Integration

1. Navigate to [notion.so/profile/integrations](https://www.notion.so/profile/integrations)
2. Click **New Integration**
3. Configure:
   - Name: "Finance Dashboard Integration" (or similar)
   - The workspace where you saved the finance dashboard from the **Associated workspace** dropdown
   - Click **Save**

#### 2.2 Configure Integration Settings

1. Go to **Access** tab
2. Press the **Select pages** button
3. Search for the "Finance Dashboard" page you copied into your workspace. Select that page
4. Press **Update access** to give the integration permission to edit the finance dashboard Notion page

#### 2.3 Get Integration Secret

1. Go back to the **Configuration** tab
2. Click **Show** next to Internal Integration Secret
3. Copy the secret key

#### 2.4 Configure Gadget Environment Variables

1. In Gadget, go to **Settings** → **Environment Variables**
2. Add the Notion API key:

   Find **NOTION_API_KEY**:

   - Paste your integration secret
   - Save

#### 2.4 Get database ID

- Scroll to the bottom of the finance dashboard and find the **Total Orders** database:
- Press the "Open as full page" button beside the blue "New" icon. This opens the database as a new page.
- In the URL, copy the ID between the last `/` and the `?`
- Example: `notion.so/workspace/[DATABASE_ID]?v=...`
- In Gadget, go to **Settings** → **Environment Variables**
- Find **NOTION_DB_ID** and paste the ID
- Save

### Part 3: Testing the Integration

#### 3.1 Create a Test Order

1. In Shopify admin, go to **Orders**
2. Click **Create Order**
3. Add products to the order
4. Select **Mark as paid** (avoids needing credit card info)
5. Create the order

#### 3.2 Verify Data Flow

1. **Check Gadget Database**:

   - Go to `api` → `models` → `shopifyOrder` → `data`
   - Verify your new order appears

2. **Check Notion Dashboard**:
   - Open your finance dashboard
   - Verify new entries appear:
     - New bar in the chart showing sales amount
     - COGS calculated based on product costs
     - Margin automatically computed
   - Check the database table for three new entries (Sales, COGS, Margin)

## Troubleshooting

### Orders Not Appearing in Notion

- Verify Shopify-Gadget sync is active
- Check environment variables are correctly set

### Missing Cost Data

- Confirm product costs are set in Shopify
- Re-sync data in Gadget after updating costs
- Check Inventory Item data in Gadget models

### Database ID Issues

- Ensure you're copying the ID from a full-page database view
- The ID is between the last `/` and the `?` in the URL
- Don't include any surrounding characters

## Architecture Notes

- **Frontend**: Located at `_index.tsx` (React-based, customizable)
- **Backend**: Gadget handles webhook events from Shopify automatically
- **Data Flow**: Order creation triggers automatic Notion update via Gadget's backend

## Resources

- [Finance Dashboard Template](https://steampunk-education.notion.site/Finance-Dashboard-249719c13e368029a77be68a7b824e35)
- [Notion Charts Documentation](https://www.notion.com/help/charts)
- [Gadget Documentation](https://docs.gadget.dev/)

Happy building!

