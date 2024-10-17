# Stripe subscriptions

This template includes essential features like basic subscription webhook handling, a user interface that displays the user's current plan and allows them to select a new one using Stripe's checkout sessions, and authentication options using Google SSO and email/password login.

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

To register for subscription webhooks in the Stripe dashboard:

- click on **Developers** in the top right corner of the Stripe dashboard
- click on **Webhooks**
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
  - note: not all subscription webhooks are currently handled in this template, only _customer.subscription.created_ and _customer.subscription.updated_
- **Reveal** the **Signing secret** for your subscription webhook in Stripe
  - copy the secret
  - open the **Environment Variables** page in Gadget
  - add the secret as the **STRIPE_SUBSCRIPTION_WEBHOOK_SECRET** variable

## Useful resources

- [Stripe's API docs](https://stripe.com/docs/api)
- [Using Stripe's test mode](https://stripe.com/docs/test-mode)
- [Using Stripe webhooks](https://stripe.com/docs/webhooks)
