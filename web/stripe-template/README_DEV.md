# Stripe payment template

This is a basic implementation of [Stripe's billing quickstart](https://stripe.com/docs/billing/quickstart?client=react&lang=node).

You can complete a basic sign-up and subscribe flow using Gadget's built-in auth and Stripe's billing. Once a new user has picked a plan to subscribe to and entered billing information (see the Stripe quickstart for test credit card data), they are only able to access a plan management page.

This template is still under-construction (in alpha), and may be modified to handle additional use cases (plan upgrades, free trials, failed payments, ...), and additional models/fields (enhanced stripeSubscription model, customer model from Stripe, ...)

## Table of contents

- [Getting started](#getting-started)
- [App overview](#app-overview)
  - [Starter template](#starter-template)
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

In order to use this app, you need to set up a few things first:

- create a [Stripe account](https://dashboard.stripe.com/register)
- enable [test mode](https://stripe.com/docs/test-mode) in Stripe for development
- enable the [customer portal](https://dashboard.stripe.com/test/settings/billing/portal) in Stripe (first option on the page)
- add a Stripe API key to your Gadget app
  - click on **Developers** in the top right corner of the Stripe dashboard
  - click on **API keys**
  - copy your secret key
  - click on **Settings** and **Environment Variables** in Gadget
  - add your test key to the **STRIPE_API_KEY** environment variable

To register for webhook in the Stripe dashboard:
- click on **Developers** in the top right corner of the Stripe dashboard
- click on **Webhooks**
- add a new webhook for the endpoint: **your-gadget-app-domain--development.gadget.app/webhook/product-price**
  - select the following events: 
    - price.created
    - price.deleted
    - price.updated
    - product.created
    - product.deleted
    - product.updated
  - this will be used to sync products (ie. your app subscription) and prices (ie. per-month price or per-year price) from Stripe to your Gadget db
- **Reveal** the **Signing secret** for your product-price webhook in Stripe
  - copy the secret
  - open the **Environment Variables** page in Gadget
  - add the secret as the **STRIPE_PRODUCT_PRICE_WEBHOOK_SECRET** variable
- add a new webhook for the endpoint: **your-gadget-app-domain--development.gadget.app/webhook/subscription**
  - select the following events: 
    - customer.subscription.created
    - customer.subscription.deleted
    - customer.subscription.paused
    - customer.subscription.pending_update_applied
    - customer.subscription.pending_update_expired
    - customer.subscription.resumed
    - customer.subscription.trial_will_end
    - customer.subscription.updated
  - this will sync subscription information from Stripe to your Gadget db
  - note: not all subscription webhooks are currently handled in this template, only *customer.subscription.created* and *customer.subscription.updated*
- **Reveal** the **Signing secret** for your subscription webhook in Stripe
  - copy the secret
  - open the **Environment Variables** page in Gadget
  - add the secret as the **STRIPE_SUBSCRIPTION_WEBHOOK_SECRET** variable

Your webhooks should be set up! You can view the status of sent webhooks from the Stripe dashboard, and use it to retry failed webhooks. Stripe also has a handy [CLI](https://stripe.com/docs/stripe-cli) that can be used to test webhooks. 

Once webhooks are set up in Stripe, you can either create your own products and prices, or run the **addSampleProducts** global action in Gadget to auto-generate test products and prices:
- click **Global Actions** in Gadget
- select **addSampleProducts**
- click on the **Run Action** button to open the API Playground with the global action mutation pre-loaded
- run the mutation

**Note**: If you create products and prices in the Stripe dashboard, you will need to add a `lookup_key` to the prices! You can do this with a custom global action in Gadget, or use the Stripe CLI.

Products and prices should be created in your Stripe dashboard. Webhooks will be fired and you should see `product` and `price` records in your Gadget app
  - click on the `product` and/or `price` model in Gadget
  - click on **Data** under the model name in the sidebar to go to the data page

## App overview

### Starter template

This app is built using the **Web app** starter template.

### Connections

No Gadget connections are used for this app template.

### Data modeling + template overview

Describe data models used for this app.

- `product`
  - a copy of Stripe's [product](https://stripe.com/docs/api/products) resource
- `price`
  - a copy of Stripe's [price](https://stripe.com/docs/api/prices) resource
- `stripeSubscription`
  - a non-complete copy of a Stripe [subscription](https://stripe.com/docs/api/subscriptions)
  - added relationship to `user` model
  - see `utils/caseConvert.js` when adding additional fields to the `stripeSubscription` model, they need to be added to `subscriptionDestructure`

#### Template default models

- `user`
   - keeps track of all users who have signed up
   - related to the `stripeSubscription` model
   - also contains a `stripeCustomerId` field to track Gadget login with Stripe customer
- `session`
  - keeps track of user sessions

### Environment variables

Variables are used for Stripe API keys and webhook secrets:
- **STRIPE_API_KEY**: the API key used when making requests thorugh the Stripe client (see `stripe.js` in Gadget project root)
- **STRIPE_PRODUCT_PRICE_WEBHOOK_SECRET**: webhook secret for products and prices webhook
- **STRIPE_SUBSCRIPTION_WEBHOOK_SECRET**: webhook secret for subscription webhook

There are also environment variables for Google auth. By default, this template will used Gadget-managed credentials for sign-in. You will need to [add your own credentials](https://docs.gadget.dev/guides/authentication/google-oauth) before deploying to production:
- **GOOGLE_CLIENT_ID**: id from Google Cloud Console OAuth creds
- **GOOGLE_CLIENT_SECRET**: secret from Google Cloud Console OAuth creds

### Backend (actions + code)

#### Stripe client

- defined in `stripe.js`
- generates a Stripe client to be used in backend routes and actions
- also exports a function used to verify webhooks, that is used in `routes/webhook` files

#### Model actions

- `user` model has a custom action: `linkToStripeCustomer`
  - this action is called after a successful subscription
  - links a Stripe customer id to a `user` record, so the user can manage their subscription by opening a Stripe portal
  - the customer id is pulled from Stripe, based off of a session id returned from a successful subscription (set in `routes/POST-create-checkout-session.js`)

#### Global actions

- `globalActions/createCheckoutSession.js`: creates a new Stripe checkout session and returns URL to frontend for redirection
- `globalActions/createPortalSession.js`: creates a portal session for the current user (Stripe customer) so they can manage their subscription

#### HTTP routes

- `routes/webhook/POST-product-price.js`: handles incoming Stripe product and price webhooks
- `routes/webhook/POST-subscription.js`: handles incoming Stripe subscription webhooks
- `routes/webhook/+scope.js`: applies a custom content parser for incoming Stripe webhook payloads

### Access roles + API permissions

- `signed-in` users have been granted access to the `user.linkToStripeCustomer` action

### Frontend

The app frontend is in the `frontend` folder.

- `frontend/App.jsx`: the main entrypoint that defines the app router and redirects to a `frontend/routes` file based on whether or not the current user is `signed-in`
- `frontend/routes`: the pages for this app, imported into `frontend/App.jsx`
  - `frontend/routes/index.jsx`: an unchanged version of the default web app template - users must sign-in to view Stripe products
  - `frontend/routes/signed-in.jsx`: the page displayed when a user is `signed-in` - displays Stripe products and prices, and allows users to make a purchase
    - users are shown different components depending on their status
    - `users` who do not have a `stripeCustomerId` see the ProductDisplay component, which displays available subscriptions
    - `users` who have a `stripeCustomerId` see the SuccessDisplay component, which allows them to redirect to Stripe to manage their subscription
- `frontend/components`: components used in `frontend/routes/signed-in.jsx`
  - `frontend/components/Logo.jsx`: a fake company logo
  - `frontend/components/Message.jsx`: a simple message, displayed to users who go to the subscription page but do not enter a valid credit card
  - `frontend/components/ProductDisplay.jsx`: displays cards with available products and prices that users can select and subscribe to
  - `frontend/components/SuccessDisplay.jsx`: displays a success card with a button that allows users to manage their subscription

## Extending this template

There are plenty of things you can do to extend this app template:

- add additional `frontend/routes` that are only accessible by `users` with a stripeCustomerId
  - this gives your paid users access to pages and features
  - to do this, define the additional route in `frontend/App.jsx` and use the [`useUser()` hook](https://docs.gadget.dev/reference/react#useuser) to grab user info and validate that a user has an active subscription
- manage additonal Stripe webhooks for `subscription` inside `routes/webhook/POST-subscription.js`
- add a Stripe customer model and subscribe to customer webhooks
  - replace the `stripeCustomerId` on the `user` model with a relationship field

#### Deploying to Production

When deploying to production, you'll need ot make sure that you have done the following:
- entered your own [Google OAuth](https://docs.ggt.dev/guides/authentication/google-oauth) client ID and secret as environment variables
- created webhook registrations in the Stripe dashboard to your production app URL
  - and sync products and prices into your Production Gadget database before granting users access to your app

### Useful resources

- [Stripe's API docs](https://stripe.com/docs/api)
- [Using Stripe's test mode](https://stripe.com/docs/test-mode)
- [Using Stripe webhooks](https://stripe.com/docs/webhooks)

## Questions?

Join our [developer Discord](https://ggt.link/discord) if you have any questions about this template or Gadget!s