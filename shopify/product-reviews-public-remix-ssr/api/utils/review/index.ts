import { Liquid } from "liquidjs";
import { readFile } from "fs/promises";
import { join } from "path";

const engine = new Liquid();

export async function generateReviewTemplate(data: {
  orderId: string;
  products: Array<{
    id: string;
    title: string;
    image: string;
    alt: string;
    reviewCreated: boolean;
    lineItemId: string;
  }>;
}): Promise<string> {
  const { orderId, products } = data;

  // Prepare the context for LiquidJS
  const context = {
    orderId,
    products: products.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.image,
      alt: product.alt,
      reviewCreated: product.reviewCreated,
      lineItemId: product.lineItemId,
    })),
  };

  // Render the template with LiquidJS
  return await engine.parseAndRender(
    await readFile(join(__dirname, "liquid", "main.liquid"), "utf-8"),
    context
  );
}
