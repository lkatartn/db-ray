import { BoxProps, Box } from "@chakra-ui/react";
import useSWR from "swr";
import { TableLink } from "@/features/connection/DatabaseLink";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const tableWithSchema = router.query.tableWithSchema;

  return (
    <>
      <Box {...props}>
        {tables?.rows?.map(
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
