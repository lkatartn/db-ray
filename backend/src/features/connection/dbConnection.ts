import knex, { Knex } from "knex";
import crypto from "crypto";

function getHashedString(input: string): string {
  const salt = "db-ray salt";
  const hash = crypto.createHmac("sha256", salt).update(input).digest("hex");
  return hash;
}
export const getDefaultConnectionOptions = async () => {
  return null;
};

let dbConnectionPool: {
  [key: string]: {
    knexConnection: ReturnType<typeof knex>;
    /**
     * crypto hash of Stringified connection options
     * that is safe to keep on fs
     */
    hash: string;
  };
} = (global as any).dbConnectionPool ? (global as any).dbConnectionPool : {};

if (!(global as any).dbConnectionPool) {
  (global as any).dbConnectionPool = dbConnectionPool;
}

export const setConnection = async (
  name: string,
  connection: Knex.PgConnectionConfig
): Promise<ReturnType<typeof knex>> => {
  dbConnectionPool[name] = {
    knexConnection: knex({
      client: "pg",
      connection,
    }),
    hash: getHashedString(JSON.stringify(connection)),
  };
  return dbConnectionPool[name].knexConnection;
};

export const getConnectionByName = (name: string) => {
  return dbConnectionPool[name];
};

const listConnections = async () => {
  return Object.keys(dbConnectionPool);
};

export const getDefaultKnexConnection = (): ReturnType<typeof knex> => {
  return getConnectionByName("default")?.knexConnection;
};

export const isConnectionFunctioning = async (
  name: string
): Promise<boolean> => {
  const connection = getConnectionByName(name).knexConnection;

  try {
    if (!connection) {
      throw new Error(`Connection ${name} not found`);
    }
    await connection.raw("SELECT 1");
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
