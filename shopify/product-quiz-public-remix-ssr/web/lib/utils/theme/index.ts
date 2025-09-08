import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import {
  type LiquidRawTag,
  toLiquidHtmlAST,
} from "@shopify/liquid-html-parser";
import type {
  Asset,
  Block,
  LiquidHtmlAST,
  ShopifyThemeBlockSchema,
} from "./types";

function extractSchemaFromAST(
  ast: LiquidHtmlAST
): ShopifyThemeBlockSchema | null {
  try {
    // Look for schema tag in the AST
    for (const node of ast.children) {
      if (node.type === "LiquidRawTag" && node.name === "schema") {
        const schemaNode = node as LiquidRawTag;

        if (schemaNode.body && schemaNode.body.kind === "json") {
          try {
            // Parse the JSON content from the schema body
            const schemaContent = schemaNode.body.value.trim();
            return JSON.parse(schemaContent);
          } catch (parseError) {
            console.error(parseError);
            return null;
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAggregatedEnabledOn() {
  const extensionFolderPath = await getThemeAppExtensionPath();

  if (!extensionFolderPath) throw new Error("No extension folder path found");

  const blocksPath = join(extensionFolderPath, "blocks");

  if (!blocksPath) throw new Error("No blocks path found");

  try {
    const blockFiles = await readdir(blocksPath);
    const allTemplates: string[] = [];

    for (const blockFile of blockFiles) {
      if (blockFile.endsWith(".liquid")) {
        const filePath = join(blocksPath, blockFile);
        const content = await readFile(filePath, "utf-8");

        // Parse Liquid file using AST
        try {
          const ast = toLiquidHtmlAST(content);
          const schema = extractSchemaFromAST(ast);

          if (schema) {
            // Check if enabled_on exists and has templates
            if (schema.enabled_on && schema.enabled_on.templates) {
              const templates = schema.enabled_on.templates;

              // If templates is ["*"], return ["*"] immediately
              if (Array.isArray(templates) && templates.includes("*")) {
                return ["*"];
              }

              // Add templates to our collection
              if (Array.isArray(templates)) {
                allTemplates.push(...templates);
              }
            } else {
              // Missing enabled_on or enabled_on.templates, return ["*"]
              return ["*"];
            }
          } else {
            // No schema found, treat as missing enabled_on
            return ["*"];
          }
        } catch (parseError) {
          console.error(parseError);
          // If Liquid parsing fails, treat as missing enabled_on
          return ["*"];
        }
      }
    }

    // Return aggregated templates, removing duplicates
    return [...new Set(allTemplates)];
  } catch (error) {
    console.error(error);
    // If there's any error reading blocks, return ["*"]
    return ["*"];
  }
}

async function getThemeAppExtensionPath(): Promise<string | null> {
  const extensionsPath = join(process.cwd(), "extensions");

  try {
    const extensions = await readdir(extensionsPath);

    for (const extension of extensions) {
      const extensionPath = join(extensionsPath, extension);
      const stats = await stat(extensionPath);

      if (stats.isDirectory()) {
        const configPath = join(extensionPath, "shopify.extension.toml");

        try {
          const configContent = await readFile(configPath, "utf-8");

          if (configContent.includes('type = "theme"')) {
            return extensionPath;
          }
        } catch (error) {
          // Config file doesn't exist or can't be read, continue to next extension
          continue;
        }
      }
    }

    return null; // No theme app extension found
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAssetsPath(
  extensionFolderPath: string
): Promise<string | null> {
  try {
    // Since extensionFolderPath is already the found theme app extension,
    // just return the path to the assets folder within it
    const assetsPath = join(extensionFolderPath, "assets");
    const assetsStats = await stat(assetsPath);

    if (assetsStats.isDirectory()) return assetsPath;

    return null; // Assets folder doesn't exist
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAssets() {
  const extensionFolderPath = await getThemeAppExtensionPath();

  if (!extensionFolderPath) return null;

  const assetsPath = await getAssetsPath(extensionFolderPath);

  if (!assetsPath) return null;

  const assetFiles = await readdir(assetsPath);

  const assets: { [key: string]: Asset } = {};

  for (const asset of assetFiles) {
    const assetPath = join(assetsPath, asset);
    const stats = await stat(assetPath);

    if (stats.isFile()) {
      assets[asset] = {
        name: asset,
        path: assetPath,
        type: asset.split(".").pop() || "",
        content: await readFile(assetPath, "utf-8"),
      };
    }
  }

  return assets;
}

/**
 * Recursively walk through the LiquidHtmlAST and collect all asset imports
 */
function extractAssetImports(ast: LiquidHtmlAST): string[] {
  const imports: string[] = [];

  const add = (val?: string) => {
    if (val) {
      imports.push(val);
    }
  };

  const exprValue = (expr: any): string | undefined =>
    expr?.type === "String"
      ? expr.value.replace(/^['"]|['"]$/g, "")
      : expr?.name ?? expr?.source ?? expr?.rawSource;

  const handleVar = (node: any) => {
    const hasAssetFilter = node.filters?.some((f: any) =>
      [
        "asset_url",
        "stylesheet_tag",
        "script_tag",
        "javascript_tag",
        "asset_img_url",
      ].includes(f.name)
    );

    if (hasAssetFilter) add(exprValue(node.expression));
  };

  const walk = (n: any) => {
    if (!n || typeof n !== "object") return;
    if (n.type === "LiquidVariableOutput") handleVar(n.markup);
    if (n.type === "LiquidVariable") handleVar(n);
    if (n.type?.startsWith("Attr")) n.value?.forEach((v: any) => walk(v));

    for (const k in n) {
      const v = n[k];
      Array.isArray(v) ? v.forEach(walk) : walk(v);
    }
  };

  walk(ast);

  // Remove duplicates and return unique imports
  return [...new Set(imports)];
}

export async function getBlockDetails(
  themeVersions: {
    pageType: string;
    filename: string;
    version: string;
  }[]
) {
  const extensionFolderPath = await getThemeAppExtensionPath();

  if (!extensionFolderPath) throw new Error("No extension folder path found");

  const blocksPath = join(extensionFolderPath, "blocks");

  if (!blocksPath) throw new Error("No blocks path found");

  const assetData = await getAssets();

  try {
    const blockFiles = await readdir(blocksPath);

    const blocks: Block[] = [];

    for (const blockFile of blockFiles) {
      if (blockFile.endsWith(".liquid")) {
        const filePath = join(blocksPath, blockFile);
        const content = await readFile(filePath, "utf-8");

        // Helper function to get theme version for a block based on enabledOn templates
        const getThemeVersions = (enabledOn: string[]) => {
          const versions = { v1: false, v2: false };

          for (const themeVersion of themeVersions) {
            // Check if any of the enabledOn templates match this theme version
            // Use pageType to match against enabledOn templates
            if (
              enabledOn.includes("*") ||
              enabledOn.some((template) => themeVersion.pageType === template)
            ) {
              if (themeVersion.version === "v1") {
                versions.v1 = true;
              } else if (themeVersion.version === "v2") {
                versions.v2 = true;
              }
            }
          }

          return versions;
        };

        const ast = toLiquidHtmlAST(content);
        const schema = extractSchemaFromAST(ast);

        if (!schema) throw new Error("No schema found in theme app extension");

        // Get enabled_on templates, default to ["*"] if not found
        const enabledOn = schema.enabled_on?.templates || ["*"];

        const assets: Asset[] = [];

        if (assetData) {
          const assetImports = extractAssetImports(ast);

          for (const assetImport of assetImports) {
            if (!assetData[assetImport])
              throw new Error(`Asset ${assetImport} not found`);

            assets.push(assetData[assetImport]);
          }
        }

        blocks.push({
          name: blockFile.replace(".liquid", ""),
          description:
            (ast.children?.[0] as any)?.body?.nodes?.[0]?.value ||
            "A description was not added to the theme app extension block. To add a description, add a comment to the top of the block file.",
          content,
          enabledOn,
          themeVersions: getThemeVersions(enabledOn),
          assets,
        });
      }
    }

    return blocks;
  } catch (error) {
    console.error(error);
    // If there's any error reading blocks, return empty array
    return [];
  }
}
