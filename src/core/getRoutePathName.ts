import path from "node:path";

export default function getRoutePathName(filePath: string, rootPath: string) {
  const dirName = path.dirname(filePath);
  path.relative(rootPath, dirName)
    .replaceAll("[", "{")
    .replaceAll("]", "}")
    .replaceAll("\\", "/")
    .replace(/\([^)]+\)\/|\/\([^)]+\)|\([^)]+\)/g, "");
}
