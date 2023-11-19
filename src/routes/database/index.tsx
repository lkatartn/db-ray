import { Outlet, useParams } from "react-router-dom";
import { TableList } from "@/common/TableList";
import { Layout } from "@/common/layout/Layout";
import { SectionHeading } from "@/common/layout/SectionHeading";

export const DataBasePage = () => {
  const params = useParams();

  return (
    <>
      <Layout
        sidebar={
          <>
            <SectionHeading>{params.database}</SectionHeading>

            <TableList database={params.database as string} mt={1} />
          </>
        }
      >
        <Outlet />
      </Layout>
    </>
  );
};
export default DataBasePage;
