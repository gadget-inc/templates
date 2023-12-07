# slack-notification-template

This application allows merchants to connect their shops to their Slack workspace. Once they have went through the OAuth flow, the merchant is prompted to select a channel where notifications will be sent. The default notification logic is for Shopify order transactions.

## Table of contents

- [Getting started](#getting-started)
- [App overview](#app-overview)
  - [Connections](#connections)
  - [Data modeling + template overview](#data-modeling-template-overview)
    - [Template default models](#template-default-models)
  - [Environment variables](#environment-variables)
  - [Backend (actions + code)](#backend-actions-code)
  - [Access roles + API permissions](#access-roles-api-permissions)
  - [Frontend](#frontend)
- [Extending this template](#extending-this-template)
- [Questions?](#questions)

## Getting started

How to use this app!

## App overview

### Connections

You will need to have a Shopify connection using the Shopify Partners connection flow. Add more

### Data modeling + template overview

Describe data models used for this app.

- `modelA`
  - a model used as an example for this Slab article

#### Template default models

- `user`
   - keeps track of all users who have signed up
- `session`
  - keeps track of user sessions

### Environment variables

These are the environment variables that are used throughout this application. Please be careful to add them or the application will not work. Please note that these environment variables should be kept secret and you should never expose them to an end user.

#### JWT_SECRET

The `JWT_SECRET` variable is used to sign and verify a JWT that is passed in the state query parameter for the Slack OAuth flow. It is used in both the `getOAuthParams.js` global action and `slack/Get-callback.js` route files. This variable is not predefined anywhere and you are required to decide what string value to use as a secret.

#### SLACK_CLIENT_ID

The `SLACK_CLIENT_ID` can be found on the Slack API on your Slack app's `Basic Information` page in the `App Credentials` section.

#### SLACK_CLIENT_SECRET

The `SLACK_CLIENT_SECRET` goes by a similar name in your Slack app. You can find this information on the Slack API under your app's `Basic Information` page in the `App Credentials` section.

### Backend (actions + code)

Describe custom code and actions. With actions as code, we will need to direct users to the important code files.

### Access roles + API permissions

Are any custom permissions added to make the API callable from the frontend?

### Frontend

Describe the frontend folder structure, and highlight any special code files.

## Extending this template

Some instructions on using the template, how to proceed (if relevant).

## Questions?

Join our [developer Discord](https://ggt.link/discord) if you have any questions about this template or Gadget!