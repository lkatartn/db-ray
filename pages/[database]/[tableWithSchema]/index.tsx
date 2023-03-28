import { useRouter } from "next/router";
import { TableList } from "@/features/tables/TableList";
import useSWR from "swr";
import { defaultFetcher } from "@/common/defaultFetcher";
import { Layout } from "@/common/layout/Layout";
import { SectionHeading } from "@/common/layout/SectionHeading";
import { QueryResultAsTable } from "@/features/queryResult/QueryResultAsTable";
import { css } from "@emotion/css";
import { colors } from "@/common/colors";
import { StillSpinner, Spinner } from "@/common/Spinner";

export const DataBasePage = () => {
  const route = useRouter();

  const [schema, ...tableName] =
    (route.query.tableWithSchema as string)?.split(".") || [];
  const table = tableName.join(".");

  const {
    data: tables,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR(
    `/api/tables/getPureTable?schema=${schema}&table=${table}&database=${route.query.database}`,
    defaultFetcher
  );

  return (
    <>
      <Layout
        defaultLayout={{
          historySection: false,
          proAI: true,
          sqlEditor: true,
        }}
        sidebar={
          <>
            <SectionHeading>{route.query.database}</SectionHeading>

            <TableList database={route.query.database as string} mt={3} />
          </>
        }
      >
        <div
          className={css({
            display: "flex",
            alignItems: "baseline",
          })}
        >
          <SectionHeading>{table}</SectionHeading>{" "}
          <button
            className={css({
              marginLeft: 10,
              padding: "8px 16px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              color: colors.blue500,
              ":hover": {
                backgroundColor: colors.blue50,
              },
            })}
            onClick={() => {
              mutate();
            }}
          >
            {isValidating && tables ? <Spinner /> : "Refresh"}
          </button>
        </div>

        <QueryResultAsTable result={tables} />
      </Layout>
    </>
  );
};
export default DataBasePage;
