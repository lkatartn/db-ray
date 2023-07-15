import { DefaultEditor } from "@/features/editor/DefaultEditor";
import { QueryResultAsTable } from "@/features/queryResult/QueryResultAsTable";
import { css, cx } from "@emotion/css";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { QueryResult } from "../queryTypes";
import { useCallableApi } from "../useCallableApi";
import { Header } from "./Header";
import { LayoutProvider, LayoutState, useLayout } from "./useLayout";
import { mutate as mutateGlobal } from "swr";
import { HistorySection } from "@/features/history/HistorySection";
import { useEditor } from "@/common/hooks/useEditor";
import { colors } from "../colors";
import { SpacerHorizontal, SpacerVertical } from "../Spacer";
import { Spinner } from "../Spinner";
import { SectionHeading } from "./SectionHeading";
import type { ProApiKeyStatus } from "@/pages/api/pro/checkProStatus";
import useSWR from "swr";
import { defaultFetcher } from "../defaultFetcher";

type LayoutProps = React.PropsWithChildren & {
  sidebar?: React.ReactNode;
  defaultLayout?: LayoutState;
};

export const Layout = ({ children, sidebar, defaultLayout }: LayoutProps) => {
  return (
    <LayoutProvider defaultLayout={defaultLayout}>
      <PageStructure>
        <Header />
        <section className="sidebar">{sidebar}</section>
        <MainContent>{children}</MainContent>
        <HistorySectionOptional />
      </PageStructure>
    </LayoutProvider>
  );
};

const PageStructure = ({ children }: LayoutProps) => {
  const { layoutState } = useLayout();
  return (
    <div
      className={
        layoutState.historySection
          ? "page-structure-with-history"
          : "page-structure-without-history"
      }
    >
      {children}
    </div>
  );
};

const HistorySectionOptional = () => {
  const { layoutState } = useLayout();
  if (!layoutState.historySection) return null;
  return (
    <section className={"history"}>
      <HistorySection />
    </section>
  );
};

const buttonClassName = css({
  display: "block",
  textWrap: "wrap",
  padding: "8px 16px",
  borderRadius: "8px",
  backgroundColor: colors.blue100,
  color: colors.blue900,
  ":hover": {
    backgroundColor: colors.blue200,
  },
  ":focus": {
    outline: "none",
    boxShadow: ` 0 0 2px 1px rgba(255,0,255,0.3), 0 0 3px 1.5px rgba(0,255,255,0.3),0 0 6px 1px rgba(0,255,255,0.1) `,
  },
  // add pressed state with light inset shadow
  ":active": {
    boxShadow: `inset 0 0 2px 1px rgba(255,0,255,0.3), inset 0 0 3px 1.5px rgba(0,255,255,0.3),inset 0 0 6px 1px rgba(0,255,255,0.1) `,
  },
});

const selectCharacterDisregardingLineBreaks = (
  editor: editor.IStandaloneCodeEditor,
  position: number
) => {
  // count lineBreaks before position
  const value = editor.getValue();
  const valueBeforePosition = value.slice(0, position);
  const lastLine = valueBeforePosition.split("\n").pop();
  const lineBreaksBeforePosition = valueBeforePosition.split("\n").length - 1;
  const columnInLine = lastLine?.length || 0;
  // this is a character position without line breaks
  const lineNumber = lineBreaksBeforePosition + 1;

  // select the error position in editor
  editor.setPosition({
    lineNumber: 1,
    column: position,
  });
  // highlight character at error position
  editor.setSelection({
    startLineNumber: lineNumber,
    startColumn: columnInLine,
    endLineNumber: lineNumber,
    endColumn: columnInLine + 1,
  });
};

const MainContent = ({ children }: React.PropsWithChildren) => {
  const { layoutState } = useLayout();

  const { call, result, loading, error } = useCallableApi<
    { query: string },
    QueryResult<Record<string, unknown>>
  >("/api/executeQuery");
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const [resultStatus, setResultStatus] = useState<string | null>(null);

  const { data } = useSWR<{ status: ProApiKeyStatus }>(
    "/api/pro/checkProStatus",
    defaultFetcher
  );

  return (
    <main className="main">
      <div
        className={css({
          padding: "0 16px 16px",
          flex: 1,
        })}
      >
        {data?.status == "active" && layoutState.proAI ? (
          <ProAISection />
        ) : null}
        {layoutState.sqlEditor ? (
          <>
            {" "}
            <div
              className={css({
                padding: "12px 4px",
              })}
            >
              <div
                className={css({
                  padding: "12px 4px",
                  resize: "vertical",
                  height: "250px",
                  overflow: "auto",
                })}
              >
                <DefaultEditor ref={editorRef} />
              </div>
            </div>
            <div
              className={css({
                display: "flex",
                alignItems: "baseline",
              })}
            >
              <button
                disabled={loading}
                className={buttonClassName}
                onClick={
                  !loading
                    ? () => {
                        const editor = editorRef.current;
                        if (editor) {
                          const value = editor.getValue();
                          const startTime = Date.now();
                          call({ query: value })
                            .then(() => {
                              const endTime = Date.now();
                              const duration = endTime - startTime;
                              mutateGlobal("/api/history/list");
                              setResultStatus(
                                `Done in ${(duration / 1000).toFixed(2)}s`
                              );
                              // to update the name of added query
                              setTimeout(() => {
                                mutateGlobal("/api/history/list");
                              }, 3000);
                            })
                            .catch((error) => {
                              if (error.position) {
                                // this is a character position without line breaks
                                const positionToSelect = +error.position;
                                selectCharacterDisregardingLineBreaks(
                                  editor,
                                  positionToSelect
                                );
                              }
                            });
                          setResultStatus(null);
                        }
                      }
                    : undefined
                }
              >
                {loading ? (
                  <>
                    Running
                    <SpacerHorizontal size={8} />
                    <Spinner />
                  </>
                ) : (
                  "Run query"
                )}
              </button>
              <span
                className={css({
                  marginLeft: "8px",
                  color: error
                    ? colors.red500
                    : result
                    ? colors.green500
                    : undefined,
                })}
              >
                {error ? "Error" : result ? resultStatus : null}
              </span>
            </div>
          </>
        ) : null}
        {error ? (
          <div>
            <pre
              className={css({
                whiteSpace: "pre-wrap",
                color: colors.gray900,
                fontSize: "12px",
                margin: "8px",
                padding: "12px",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                overflow: "auto",
                maxHeight: "50vh",
              })}
            >
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        ) : null}
        {result ? (
          <>
            <SpacerVertical size={8} />
            <SectionHeading>Query Result</SectionHeading>
            <QueryResultAsTable result={result} />
            <SpacerVertical size={8} />
          </>
        ) : null}

        {children}
      </div>
    </main>
  );
};

const ProAISection = () => {
  const { call: promptForCode, loading } = useCallableApi<
    {
      prompt: string;
      databaseName?: string;
      scheme?: string;
    },
    unknown
  >("/api/pro/plainPrompt");
  const route = useRouter();
  const { editor } = useEditor();

  return (
    <section
      className={css({
        padding: "12px 4px",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "flex-start",
        })}
      >
        <textarea
          className={css({
            display: "block",
            width: "calc(100% - 32px)",
            minWidth: "360px",
            maxWidth: "800px",
            height: "68px",
            borderRadius: "8px",
            boxSizing: "border-box",
            marginTop: "8px",
            padding: "8px",
            ":focus": {
              outline: "none",
              boxShadow: ` 0 0 2px 1px rgba(255,0,255,0.3), 0 0 3px 1.5px rgba(0,255,255,0.3),0 0 6px 1px rgba(0,255,255,0.1) `,
              // boxShadow: `1px solid ${colors.blue500}`,
            },
          })}
          placeholder="Enter prompt here"
          name="prompt"
        ></textarea>
        <button
          disabled={loading}
          className={cx(
            buttonClassName,
            css({
              margin: "8px 0 0 16px",
            })
          )}
          onClick={
            !loading
              ? () => {
                  promptForCode({
                    prompt: (
                      document.getElementsByName(
                        "prompt"
                      )[0] as HTMLTextAreaElement
                    ).value,
                    databaseName: route.query.database as string,
                  }).then((result) => {
                    if (editor) {
                      const fullModelRange = editor
                        ?.getModel()
                        ?.getFullModelRange();
                      // Replace the editor content
                      fullModelRange &&
                        editor?.getModel()?.pushEditOperations(
                          [],
                          [
                            {
                              range: fullModelRange,
                              text: result.query,
                            },
                          ],
                          () => null
                        );
                    }
                  });
                }
              : undefined
          }
        >
          {loading ? (
            <>
              Loading
              <SpacerHorizontal size={8} />
              <Spinner />
            </>
          ) : (
            "Generate query"
          )}
        </button>
      </div>
    </section>
  );
};
