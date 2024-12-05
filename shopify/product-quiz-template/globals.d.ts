// custom.d.ts
declare module "*.webm" {
  const src: string;
  export default src;
}

declare module "*.js?raw" {
  const src: string;
  export default src;
}

declare module "*.liquid?raw" {
  const src: string;
  export default src;
}
