import { SectionHeading } from "@/common/layout/SectionHeading";
import { QueryResult, Field } from "@/common/queryTypes";
import { css } from "@emotion/css";

interface QueryResultAsTableProps<T extends any> {
  result?: QueryResult<T>;
}

export const QueryResultAsTable = <T extends any>({
  result,
}: QueryResultAsTableProps<T>) => {
  if (!result || !result.fields)
    return (
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "1rem",
          minWidth: "200px",
          minHeight: "50px",
        })}
      >
        Cannot display the result
      </div>
    );
  return (
    <>
      <div
        className={css({
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
          overflow: "auto",
          margin: 4,
        })}
      >
        <table>
          <thead>
            <tr>
              {result.fields.map((field) => {
                return (
                  <th key={field.name as string}>{field.name.toString()}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <Row row={row} fields={result.fields} key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const stringifyColumnValue = (
  value: unknown,
  fieldDataTypeID: number
): string => {
  // this is JSON
  if (fieldDataTypeID === 114) {
    return JSON.stringify(value);
  }

  return (value as any)?.toString();
};

const Row = <T extends any>({
  row,
  fields,
}: {
  row: QueryResult<T>["rows"][number];
  fields: QueryResult<T>["fields"];
}) => {
  return (
    <tr>
      {fields.map((field) => {
        const isNumberic = field.dataTypeID === 20 || field.dataTypeID === 21;
        const resultAsString = stringifyColumnValue(
          row[field.name],
          field.dataTypeID
        );
        return (
          <td
            key={field.name as string}
            className={css({
              textAlign: isNumberic ? "right" : "left",
            })}
            title={resultAsString}
          >
            {resultAsString}
          </td>
        );
      })}
    </tr>
  );
};
