import { useRouter } from "next/router";
import { TableList } from "@/features/tables/TableList";
import { Layout } from "@/common/layout/Layout";
import { SectionHeading } from "@/common/layout/SectionHeading";

export const DataBasePage = () => {
  const route = useRouter();

  return (
    <>
      <Layout
        sidebar={
          <>
            <SectionHeading>{route.query.database}</SectionHeading>

            <TableList database={route.query.database as string} mt={3} />
          </>
        }
      ></Layout>
    </>
  );
};
export default DataBasePage;
