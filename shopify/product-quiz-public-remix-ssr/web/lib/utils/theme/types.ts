import type { LiquidRawTag } from "@shopify/liquid-html-parser";

// Types for the Liquid AST schema node
interface Position {
  start: number;
  end: number;
}

export interface LiquidHtmlAST {
  type: string;
  source: string;
  _source: string;
  children: (LiquidRawTag | any)[];
  name: string;
  position: Position;
}

export type Asset = {
  name: string;
  path: string;
  type: string;
  content: string;
};

export type Block = {
  name: string;
  content: string;
  description: string;
  enabledOn: string[];
  themeVersions: {
    v1: boolean;
    v2: boolean;
  };
  assets: Asset[];
};

export type ShopifyThemeBlockSchema = {
  name: string;
  stylesheet?: string;
  target?: string;
  settings?: Array<{
    type: string;
    id: string;
    label?: string;
    default?: any;
    [key: string]: any;
  }>;
  enabled_on?: {
    templates: string[];
  };
  presets?: Array<{
    name: string;
    settings?: Record<string, any>;
  }>;
  max_blocks?: number;
  blocks?: Record<
    string,
    {
      type: string;
      name?: string;
      settings?: Array<{
        type: string;
        id: string;
        label?: string;
        default?: any;
        [key: string]: any;
      }>;
    }
  >;
  [key: string]: any;
};
