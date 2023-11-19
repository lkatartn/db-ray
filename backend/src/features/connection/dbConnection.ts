import knex, { Knex } from "knex";

export const getDefaultConnectionOptions = async () => {
  return null;
};

let dbConnectionPool: {
  [key: string]: ReturnType<typeof knex>;
} = (global as any).dbConnectionPool ? (global as any).dbConnectionPool : {};

if (!(global as any).dbConnectionPool) {
  (global as any).dbConnectionPool = dbConnectionPool;
}

export const setConnection = async (
  name: string,
  connection: Knex.PgConnectionConfig
) => {
  dbConnectionPool[name] = knex({
    client: "pg",
    connection,
  });
  return dbConnectionPool[name];
};

const getConnectionByName = (name: string) => {
  return dbConnectionPool[name];
};

const listConnections = async () => {
  return Object.keys(dbConnectionPool);
};

export const getDefaultConnection = () => {
  return getConnectionByName("default");
};

export const isConnectionFunctioning = async (name: string) => {
  const connection = getConnectionByName(name);

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
