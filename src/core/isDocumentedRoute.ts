import fs from "node:fs/promises";

const SUPPORTED_PACKAGE_NAMES = [
  "@spikers/next-openapi-route-handler",
  "@omer-x/next-openapi-route-handler",
];

export default async function isDocumentedRoute(routePath: string) {
  try {
    const rawCode = await fs.readFile(routePath, "utf-8");
    return SUPPORTED_PACKAGE_NAMES.some(name => rawCode.includes(name));
  } catch {
    return false;
  }
}
