import NextLink from "next/link";
import { css } from "@emotion/css";
import { colors } from "@/common/colors";

export interface DatabaseLinkProps {
  databaseName: string;
  isActive?: boolean;
}
export const DatabaseLink = ({ databaseName, isActive }: DatabaseLinkProps) => {
  return (
    <NextLink href={`/${databaseName}`}>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
          ":hover": {
            backgroundColor: colors.gray100,
          },
          backgroundColor: isActive ? colors.gray100 : "transparent",
        })}
        title={databaseName}
      >
        {databaseName}
      </div>
    </NextLink>
  );
};
export const TableLink = ({
  databaseName,
  tableName,
  schema,
  isActive,
}: {
  databaseName: string;
  tableName: string;
  schema?: string;
  isActive?: boolean;
}) => {
  return (
    <NextLink href={`/${databaseName}/${schema}.${tableName}`}>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
          ":hover": {
            backgroundColor: colors.gray100,
          },
          backgroundColor: isActive ? colors.gray100 : "transparent",
        })}
        title={schema ? `${schema}.${tableName}` : tableName}
      >
        {schema ?? ""}.{tableName}
      </div>
    </NextLink>
  );
};
