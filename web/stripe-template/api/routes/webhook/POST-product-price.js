import { RouteContext } from "gadget-server";
import { stripe, getStripeWebhookEvent } from "../../stripe";
import { objKeyConvert } from "../../utils/caseConvert";

/**
 * Route handler for POST webhook/product-price
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  let event = request.body;

  try {
    event = getStripeWebhookEvent({ logger, request, endpointSecret: process.env.STRIPE_PRODUCT_PRICE_WEBHOOK_SECRET })
    logger.info({ event }, "my event")
  } catch (err) {
    logger.error({ err }, "Stripe webhook error")
    return await reply.status(400).send();
  }

  // /**
  //  * Note: objKeyConvert is used to convert snake_case data coming from Stripe to camelCase. Date/time fields are converted, and stripe "id" fields are changed to "stripeId" 
  //  */

  // handle webhook events
  // all webhooks fire corresponding create, update, or delete actions for the "product" and "price" models
  switch (event.type) {
    case 'price.created':
      const priceCreated = objKeyConvert(event.data.object);

      // see if the product has already been added to the Gadget db
      let product = await api.product.maybeFindFirst({ filter: { stripeId: { equals: priceCreated.product } }, select: { id: true } })
      if (!product) {
        // webhook order is not guaranteed, so extra handling is needed if the product webhook is not successfully handled before the price webhook
        // if the product has not been created, fetch from Stripe
        const stripeProduct = await stripe.products.retrieve(priceCreated.product);
        try {
          // try creating the fetched product
          product = await api.product.create(objKeyConvert(stripeProduct));
        } catch (e) {
          logger.info({ e }, "Product already created in Gadget DB, refetching...")
          // if the create fails, an incoming product webhook may have been processed, so fetch the product instead
          product = await api.product.maybeFindFirst({ filter: { stripeId: { equals: priceCreated.product } }, select: { id: true } });
        }
      }

      // link to the existing product
      priceCreated.product = {
        _link: product.id
      };
      // call the price.create action to add a new price record
      await api.price.create(priceCreated);
      logger.info({ priceCreated }, "Stripe Price created")
      break;

    case 'price.deleted':
      const priceDeleted = objKeyConvert(event.data.object);
      // grab the Gadget id of the price to delete
      const priceToDelete = await api.price.maybeFindFirst({ filter: { stripeId: { equals: priceDeleted.stripeId } }, select: { id: true, stripeId: true } });
      if (priceToDelete) {
        // call the price.delete action to delete the price record
        await api.price.delete(priceToDelete.id);
        logger.info({ priceDeleted }, "Stripe Price deleted")
      } else {
        logger.warn({ priceDeleted }, "Stripe Price not found")
      }
      break;

    case 'price.updated':
      const priceUpdated = objKeyConvert(event.data.object);
      // grab the Gadget id of the price to update
      const priceToUpdate = await api.price.maybeFindFirst({ filter: { stripeId: { equals: priceUpdated.stripeId } }, select: { id: true, productId: true } });

      if (priceToUpdate) {
        if (priceToUpdate.productId !== priceUpdated.product) {
          // link the price to a product, if the link does not exist or has changed
          const productForPriceUpdate = await api.product.maybeFindFirst({ filter: { stripeId: { equals: priceUpdated.product } }, select: { id: true } });
          priceUpdated.product = {
            _link: productForPriceUpdate.product
          };
        }
        // call the price.updated action to update the price
        await api.price.update(priceToUpdate.id, priceUpdated);
        logger.info({ priceUpdated }, "Stripe Price updated")
      } else {
        logger.warn({ priceUpdated }, "Stripe Price not found, no update applied")
      }
      break;

    case 'product.created':
      const productCreated = objKeyConvert(event.data.object);
      // handle any duplicate webhook events or retries
      const doesProductExist = await api.product.maybeFindFirst({ filter: { stripeId: { equals: productCreated.stripeId } } });
      if (!doesProductExist) {
        // call the product.create action to add a new product record
        await api.product.create(productCreated);
        logger.info({ productCreated }, "Stripe Product created")
      }
      break;

    case 'product.deleted':
      const productDeleted = objKeyConvert(event.data.object);
      // get the Gadget id of the product to delete
      const productToDelete = await api.product.maybeFindFirst({ filter: { stripeId: { equals: productDeleted.stripeId } }, select: { id: true } });
      if (productToDelete) {
        // call the product.delete action to delete the product record
        await api.product.delete(productToDelete.id);
        logger.info({ productDeleted }, "Stripe Product deleted")
      } else {
        logger.warn({ productDeleted }, "Stripe Product not found")
      }
      break;

    case 'product.updated':
      const productUpdated = objKeyConvert(event.data.object);
      // get the Gadget id of the product that needs updating
      const productToUpdate = await api.product.maybeFindFirst({ filter: { stripeId: { equals: productUpdated.stripeId } }, select: { id: true } });
      if (productToUpdate) {
        // call the product.update action to update the product
        await api.product.update(productToUpdate.id, productUpdated);
        logger.info({ productUpdated }, "Stripe Product updated")
      } else {
        logger.warn({ productUpdated }, "Stripe Product not found, update not applied")
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  await reply.send();
}