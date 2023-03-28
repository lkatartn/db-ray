import { saveApiKey, getApiKey } from "@/common/appData";
import { DOMAIN } from "./domain";

const API_PATH = "/api";
const API_URL = `${DOMAIN}${API_PATH}`;

export const tokenStorage = {
  token: "",
  get: () => {
    if (!tokenStorage.token) {
      getApiKey().then((token) => {
        tokenStorage.token = token || "";
      });
    }
    return tokenStorage.token;
  },
  set: (token: string) => {
    console.log("saved token", token);
    tokenStorage.token = token;
    saveApiKey(token);
  },
};

getApiKey().then((token) => {
  tokenStorage.token = token || "";
});

const getToken = tokenStorage.get;

const baseFetcher = async <Input extends any, Output extends any>(
  path: string,
  options: Input
) => {
  const response = await fetch(API_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: getToken(),
    },
    body: JSON.stringify(options),
  });
  const data = await response.json();
  return data as Output;
};

export const getNameForQuery = async (query: string) => {
  const response = await baseFetcher<{ query: string }, { name: string }>(
    "/getQueryName",
    { query }
  );
  return response.name;
};
export const getSQLQueryFromPrompt = async (prompt: string) => {
  const response = await baseFetcher<{ prompt: string }, { query: string }>(
    "/prompt",
    { prompt }
  );
  return response.query;
};

export const checkAPIKey = async () => {
  const response = await baseFetcher<{}, { isActive: boolean }>(
    "/checkAPIKey",
    {}
  );
  return response.isActive;
};
interface Context {
  databaseName: string;
  tables: {
    name: string;
    columns: {
      name: string;
      type: string;
    }[];
  }[];
}
export const getSQLQueryFromPromptWithContext = async (
  prompt: string,
  context: Context
) => {
  const response = await baseFetcher<
    { prompt: string; context: Context },
    { query: string }
  >("/prompt", { prompt, context });
  return response.query;
};
