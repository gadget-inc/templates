export default (items) => {
  const packages = [];

  /* 
    Very basic way of making packages
    This doesn't account for size/dimensions of item nor splitting the items into multiple packages if the dimensions are too big
  */
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
