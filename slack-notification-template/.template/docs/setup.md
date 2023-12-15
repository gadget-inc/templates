## Getting started

A list of steps that you should follow:

1. [Setup your Slack app](https://api.slack.com/). Make sure to refer to this document and code comments for instructions on how to set up the application.

2. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

3. Using the Partner dashboard, install your Shopify app on a Shopify development store.

4. Test the Slack OAuth flow, Slack channel selection and notifications. To test notifications makes sure to place a [bogus](https://help.shopify.com/en/manual/checkout-settings/test-orders#place-a-test-order-by-simulating-a-transaction) order through your development store's checkout.

## Slack app setup

Below is a list of specifics for how to set up a Slack app for this template. First, [create your Slack app](https://api.slack.com/) by choosing the "from scratch" option, naming it and choosing a workspace to test on.

- OAuth & Permissions
  - Select permissions:
    - `channels:read`: Allows your application to read a list of public Slack channels
    - `channels:join`: Allows your Slack bot to join Slack channels
    - `channels:manage`: Allows your Slack bot to leave Slack channels
    - `chat:write`: Allows your Slack bot to write messages in channels
  - Add your Gadget app's redirect URLs. For example, `<yourAppName>--development.gadget.app/slack/callback`.
- Install your Slack app on your chosen workspace
- Add environment variables to your Gadget app
  - `SLACK_SCOPES`: Comma separated list of Slack access scopes that were selected in the OAuth & Permissions step
  - `SLACK_CLIENT_ID`: The client id found on the "Basic Information" page of your Slack app
  - `SLACK_CLIENT_SECRET`: The client secret found on the "Basic Information" page of your Slack app
  - `JWT_SECRET`: A UUID used for creating and verifying a JWT that is sent as the Slack OAuth `state` query parameter
