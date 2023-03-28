import useSWR from "swr";
import { DatabaseLink } from "@/features/connection/DatabaseLink";
import { defaultFetcher } from "@/common/defaultFetcher";
import { SectionHeading } from "@/common/layout/SectionHeading";
import { Layout } from "@/common/layout/Layout";

export default function Home() {
  const { data: databases, error } = useSWR(
    "/api/getDatabases",
    defaultFetcher
  );

  return (
    <>
      <Layout
        sidebar={
          <>
            <SectionHeading>Databases</SectionHeading>
            {databases?.map((db: { datname: string }, i: number) => (
              <DatabaseLink key={i} databaseName={db.datname}></DatabaseLink>
            ))}
          </>
        }
      ></Layout>
    </>
  );
}
