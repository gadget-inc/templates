/**
 * @param {Array<{name: string, sku: string, grams: number, price: number, vendor: string, requires_shipping: boolean, taxable: boolean, fulfillment_service: string, product_id: number, variant_id: number}>} items - An array of items.
 *
 * This function takes in an array of items and returns an array of packages.
 *
 * @returns {{weight: { value: number, units: string}}[]} An array of packages
 */
export default (items) => {
  const packages = [];

  // This is a very basic way of making packages. It is recommended to update this file.
  for (const item of items) {
    packages.push({
      weight: {
        value: (item.quantity * item.grams) / 1000,
        units: "KG",
      },
    });
  }

  return packages;
};
