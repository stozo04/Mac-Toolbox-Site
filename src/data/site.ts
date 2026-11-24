import catalog from "./tools.json";

export const APP_NAME = "Mac Toolbox";
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

export interface CompanionCard {
  name: string;
  category: string;
  tagline: string;
  companion: string;
}

type CatalogEntry = Omit<Tool, "working"> & { working?: boolean; companion?: string };

const COMPANION_PAGES: Record<string, string> = {
  folio: "https://github.com/Forward-Future/folio",
  scarlet: "https://github.com/Forward-Future/scarlet",
};

const entries: CatalogEntry[] = catalog.tools;
const isCompanion = (entry: CatalogEntry): entry is CompanionCard => entry.companion !== undefined;

export const version: string = catalog.version;
export const tools: Tool[] = entries.filter((entry): entry is Tool => !isCompanion(entry));
export const companions: CompanionCard[] = entries.filter(isCompanion);
export const workingCount = tools.filter((tool) => tool.working).length;
export const openCount = tools.length - workingCount;

export const categories = [...new Set(entries.map((entry) => entry.category))].map((name) => {
  const inCategory = tools.filter((tool) => tool.category === name);
  return {
    name,
    working: inCategory.filter((tool) => tool.working),
    open: inCategory.filter((tool) => !tool.working),
    companions: companions.filter((card) => card.category === name),
  };
});

export function companionUrl(card: CompanionCard): string {
  const page = COMPANION_PAGES[card.companion];
  if (!page) throw new Error(`No page for the companion app "${card.companion}".`);
  return page;
}

export function briefUrl(tool: Tool): string {
  const folder = tool.name.replaceAll('"', "");
  return `${REPO_URL}/tree/main/features/${encodeURIComponent(tool.category)}/${encodeURIComponent(folder)}`;
}
