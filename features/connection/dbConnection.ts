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

// check if params are passed to env
[
  process.env.DB_PARAM_HOST,
  process.env.DB_PARAM_PORT,
  process.env.DB_PARAM_USERNAME,
  process.env.DB_PARAM_DBNAME || "postgres",
  process.env.DB_PARAM_PASSWORD,
].every((param) => param !== undefined) &&
  setConnection("default", {
    host: process.env.DB_PARAM_HOST,
    port: parseInt(process.env.DB_PARAM_PORT!),
    user: process.env.DB_PARAM_USERNAME,
    password: process.env.DB_PARAM_PASSWORD,
    database: process.env.DB_PARAM_DBNAME,
  });

const getConnectionByName = async (name: string) => {
  return dbConnectionPool[name];
};

const listConnections = async () => {
  return Object.keys(dbConnectionPool);
};

export const getDefaultConnection = async () => {
  return getConnectionByName("default");
};
