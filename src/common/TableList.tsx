import { BoxProps, Box, chakra } from "@chakra-ui/react";
import useSWR from "swr";
import { TableLink } from "@/common/DatabaseLink";
import { useParams } from "react-router-dom";
import { defaultFetcher } from "@/common/defaultFetcher";

interface TableListProps {
  database: string;
}

export const TableList = ({
  database,
  ...props
}: TableListProps & BoxProps) => {
  const { data: tables, error } = useSWR(
    `/api/tables/${database}`,
    defaultFetcher
  );
  const params = useParams();
  const tableWithSchema = params.tableWithSchema;

  if (error) {
    return (
      <Box ml={4} {...props}>
        <chakra.p color="red.500">Error: {JSON.stringify(error)}</chakra.p>
      </Box>
    );
  }

  return (
    <>
      <Box {...props}>
        {(tables?.rows || []).map(
          (table: { table_name: string; table_schema: string }, i: number) => (
            <TableLink
              schema={table["table_schema"]}
              databaseName={database}
              tableName={table["table_name"]}
              isActive={
                table["table_schema"] + "." + table["table_name"] ===
                tableWithSchema
              }
              key={i}
            />
          )
        )}
      </Box>
    </>
  );
};
