import { getDefaultConnection } from "./dbConnection";

interface TableContext {
  name: string;
  schema?: string;
  columns: {
    name: string;
    type: string;
  }[];
  foreignKeys: {
    columnName: string;
    foreignTableSchema: string;
    foreignTableName: string;
    foreignColumnName: string;
  }[];
}

export const getTablesStructureContextForDatabase = async (
  databaseName: string
): Promise<TableContext[]> => {
  const conn = await getDefaultConnection();
  const tableStructure = await conn.raw(
    `
      SELECT
          table_name,
          table_schema,
          jsonb_agg(
              jsonb_build_object(
                  'type', data_type,
                  'name', column_name
              )
          ORDER BY ordinal_position) AS table_columns
      FROM
          information_schema.columns
      WHERE
          table_catalog = :databaseName
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
      GROUP BY
          table_name,
          table_schema
      ORDER BY
          table_name;
        `,
    {
      databaseName,
    }
  );

  const foreignKeys = await getForeignKeyConstraints();
  const tableKeyMap = foreignKeys.reduce((acc, fk) => {
    const key = `${fk.table_schema}.${fk.table_name}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({
      columnName: fk.column_name,
      foreignTableSchema: fk.foreign_table_schema,
      foreignTableName: fk.foreign_table_name,
      foreignColumnName: fk.foreign_column_name,
    });
    return acc;
  }, {} as Record<string, TableContext["foreignKeys"]>);

  const tables = (
    tableStructure.rows as {
      table_name: string;
      table_schema: string;
      table_columns: {
        name: string;
        type: string;
      }[];
    }[]
  ).reduce((acc: TableContext[], row) => {
    const table = {
      name: row.table_name,
      schema: row.table_schema,
      columns: row.table_columns,
      foreignKeys: tableKeyMap[`${row.table_schema}.${row.table_name}`] || [],
    };
    acc.push(table);
    return acc;
  }, [] as TableContext[]);
  return tables;
};

export const getForeignKeyConstraints = async (): Promise<
  {
    table_schema: string;
    table_name: string;
    column_name: string;
    foreign_table_schema: string;
    foreign_table_name: string;
    foreign_column_name: string;
  }[]
> => {
  const conn = await getDefaultConnection();
  const result = await conn.raw(
    `
    SELECT
      tc.table_schema,
      tc.table_name,
      kcu.column_name,
      ccu.table_schema as foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY';
    `
  );
  return result.rows || [];
};
