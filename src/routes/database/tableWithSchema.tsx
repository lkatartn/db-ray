import useSWR from "swr";
import { defaultFetcher } from "@/common/defaultFetcher";
import { SectionHeading } from "@/common/layout/SectionHeading";
import { QueryResultAsTable } from "@/common/QueryResultAsTable";
import { css } from "@emotion/css";
import { colors } from "@/common/colors";
import { Spinner } from "@/common/Spinner";
import { useParams } from "react-router-dom";

export const DataBasePage = () => {
  const params = useParams();

  const tableWithSchema = params.tableWithSchema;

  const [schema, ...tableName] = (tableWithSchema as string)?.split(".") || [];
  const table = tableName.join(".");

  const {
    data: tables,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR(
    `/api/tables/getPureTable?schema=${schema}&table=${table}&database=${params.database}`,
    defaultFetcher
  );

  return (
    <>
      <div
        className={css({
          display: "flex",
          alignItems: "baseline",
        })}
      >
        <SectionHeading mt={1}>{table}</SectionHeading>{" "}
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
    </>
  );
};
export default DataBasePage;
