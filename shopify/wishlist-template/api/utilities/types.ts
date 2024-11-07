export type Payload =
  | { changes: Changes; count: number; firstName: string; lastName: string }
  | {
      product: { handle: string; title: string };
      shop: { name: string; domain: string };
      id: string;
      title: string;
    };

export type OnSaleVariant = {
  id: string;
  title: string;
  productTitle: string;
  price: string;
  compareAtPrice: string;
  image: { source: string; alt: string };
};

export type RemovedVariant = {
  id: string;
  title: string;
  productTitle: string;
  image: { source: string; alt: string };
};

export type Changes = {
  removed: {
    [key: string]: RemovedVariant;
  };
  onSale: {
    [key: string]: OnSaleVariant;
  };
};
