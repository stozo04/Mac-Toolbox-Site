import catalog from "./tools.json";

export const APP_NAME = "Sidekit";
export const REPO_URL = "https://github.com/stozo04/Mac-Toolbox";
export const SITE_REPO_URL = "https://github.com/stozo04/sidekit-site";
export const DOWNLOAD_URL = `${REPO_URL}/releases/latest`;
export const ISSUES_URL = `${REPO_URL}/issues/new/choose`;
export const DISCUSSIONS_URL = `${REPO_URL}/discussions`;
export const CONTRIBUTING_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;

export interface Tool {
  name: string;
  category: string;
  tagline: string;
  working: boolean;
}

export const version: string = catalog.version;
export const tools: Tool[] = catalog.tools;
export const workingCount = tools.filter((tool) => tool.working).length;
export const openCount = tools.length - workingCount;

export const categories = [...new Set(tools.map((tool) => tool.category))].map((name) => {
  const inCategory = tools.filter((tool) => tool.category === name);
  return {
    name,
    working: inCategory.filter((tool) => tool.working),
    open: inCategory.filter((tool) => !tool.working),
  };
});

export function briefUrl(tool: Tool): string {
  const folder = tool.name.replaceAll('"', "");
  return `${REPO_URL}/tree/main/features/${encodeURIComponent(tool.category)}/${encodeURIComponent(folder)}`;
}
