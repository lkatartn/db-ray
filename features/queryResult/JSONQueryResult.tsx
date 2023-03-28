import Editor from "@monaco-editor/react";
import { useMemo } from "react";

export const JSONQueryResult = ({ result }: { result: any | string }) => {
  const jsonString = useMemo(() => {
    if (typeof result === "string") {
      return result;
    }
    return JSON.stringify(result, null, 2);
  }, [result]);

  return (
    <Editor
      height="300px"
      defaultLanguage="json"
      value={jsonString}
      options={{ lineNumbers: "off", minimap: { enabled: false } }}
    />
  );
};
