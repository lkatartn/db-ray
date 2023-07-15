import path from "path";
import fs from "fs";
import os from "os";

const APP_FOLDER_NAME = "db-ray";

export const getAppDataFolder = () => {
  const appDataFolder =
    process.env.APPDATA ||
    (process.platform == "darwin"
      ? process.env.HOME + "/Library/Preferences"
      : path.join(os.homedir(), ".local", "share"));
  return appDataFolder;
};

export interface HistoryRecord {
  query: string;
  createdAt: string;
  lastExecutedAt?: string;
  /**
   * The name of the database that this query was executed on
   */
  forDatabase?: string;
  name?: string;
}

interface AppDataStructure {
  version: "v1";
  connections: {
    [key: string]: {
      name: string;
      history: HistoryRecord[];
    };
  };
  apiKey?: string;
}

function createDirIfNotExists(dir: string) {
  if (!fs.existsSync(dir)) {
    createDirIfNotExists(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}

const getOrCreateHistoryFile = async () => {
  const appDataFolder = await getAppDataFolder();
  const appDataPath = path.join(appDataFolder, APP_FOLDER_NAME);
  const historyFilePath = path.join(appDataPath, "history.json");

  createDirIfNotExists(appDataPath);

  if (!fs.existsSync(historyFilePath)) {
    fs.writeFileSync(
      historyFilePath,
      JSON.stringify({ version: "v1", connections: {} })
    );
  }

  return historyFilePath;
};

export const addHistoryRecord = async ({
  connectionName,
  query,
  name,
  forDatabase,
}: {
  connectionName: string;
  query: string;
  name?: string;
  forDatabase?: string;
}) => {
  const historyFilePath = await getOrCreateHistoryFile();
  const historyFile = JSON.parse(
    fs.readFileSync(historyFilePath, { encoding: "utf-8" })
  ) as AppDataStructure;
  if (!historyFile.connections[connectionName]) {
    historyFile.connections[connectionName] = {
      name: connectionName,
      history: [],
    };
  }

  // if the query already exists set the lastExecutedAt date
  const existingQueryIndex = historyFile.connections[
    connectionName
  ].history.findIndex((record) => record.query === query);

  if (existingQueryIndex !== -1) {
    historyFile.connections[connectionName].history[existingQueryIndex] = {
      ...historyFile.connections[connectionName].history[existingQueryIndex],
      lastExecutedAt: new Date().toISOString(),
    };

    // put the record at the top of the list
    historyFile.connections[connectionName].history = [
      historyFile.connections[connectionName].history[existingQueryIndex],
      ...historyFile.connections[connectionName].history.filter(
        (_, index) => index !== existingQueryIndex
      ),
    ];

    fs.writeFileSync(historyFilePath, JSON.stringify(historyFile));
    return historyFile.connections[connectionName].history[existingQueryIndex];
  }

  historyFile.connections[connectionName].history = [
    {
      query,
      createdAt: new Date().toISOString(),
      lastExecutedAt: new Date().toISOString(),
      name,
      forDatabase,
    },
    ...historyFile.connections[connectionName].history,
  ];
  fs.writeFileSync(historyFilePath, JSON.stringify(historyFile));
  return historyFile.connections[connectionName].history[0];
};

export const getHistoryRecords = async (connectionName: string) => {
  const historyFilePath = await getOrCreateHistoryFile();
  const historyFile = JSON.parse(
    fs.readFileSync(historyFilePath, { encoding: "utf-8" })
  ) as AppDataStructure;
  if (!historyFile.connections[connectionName]) {
    historyFile.connections[connectionName] = {
      name: connectionName,
      history: [],
    };
  }
  return historyFile.connections[connectionName].history;
};

export const editHistoryRecordByCreationDate = async ({
  connectionName,
  createdAt,
  ...newHistoryRecordFields
}: {
  connectionName: string;
  createdAt: string;
  lastExecutedAt?: string;
  name?: string;
  query?: string;
}) => {
  const historyFilePath = await getOrCreateHistoryFile();
  const historyFile = JSON.parse(
    fs.readFileSync(historyFilePath, { encoding: "utf-8" })
  ) as AppDataStructure;
  if (!historyFile.connections[connectionName]) {
    return null;
  }
  const historyRecordIndex = historyFile.connections[
    connectionName
  ].history.findIndex((record) => record.createdAt === createdAt);
  if (historyRecordIndex === -1) {
    return null;
  }
  historyFile.connections[connectionName].history[historyRecordIndex] = {
    ...historyFile.connections[connectionName].history[historyRecordIndex],
    ...newHistoryRecordFields,
  };
  fs.writeFileSync(historyFilePath, JSON.stringify(historyFile));
};

export const deleteHistoryRecordByCreationDate = async ({
  connectionName,
  createdAt,
}: {
  connectionName: string;
  createdAt: string;
}) => {
  const historyFilePath = await getOrCreateHistoryFile();
  const historyFile = JSON.parse(
    fs.readFileSync(historyFilePath, { encoding: "utf-8" })
  ) as AppDataStructure;
  if (!historyFile.connections[connectionName]) {
    return null;
  }
  const historyRecordIndex = historyFile.connections[
    connectionName
  ].history.findIndex((record) => record.createdAt === createdAt);
  if (historyRecordIndex === -1) {
    return null;
  }
  historyFile.connections[connectionName].history.splice(historyRecordIndex, 1);
  fs.writeFileSync(historyFilePath, JSON.stringify(historyFile));
};

export const saveApiKey = async (apiKey: string) => {
  const historyFilePath = await getOrCreateHistoryFile();
  const historyFile = JSON.parse(
    fs.readFileSync(historyFilePath, { encoding: "utf-8" })
  ) as AppDataStructure;
  historyFile.apiKey = apiKey;
  fs.writeFileSync(historyFilePath, JSON.stringify(historyFile));
};
export const getApiKey = async () => {
  const historyFilePath = await getOrCreateHistoryFile();
  const historyFile = JSON.parse(
    fs.readFileSync(historyFilePath, { encoding: "utf-8" })
  ) as AppDataStructure;
  return historyFile.apiKey;
};
