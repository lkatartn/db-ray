import { useEditor } from "@/common/hooks/useEditor";
import Editor from "@monaco-editor/react";
import { forwardRef, MutableRefObject } from "react";

const getDefaltEditor = () => {};

export const DefaultEditor = forwardRef((props, ref) => {
  const { setEditor } = useEditor();
  return (
    <Editor
      height="100%"
      defaultLanguage="sql"
      defaultValue="SELECT * FROM pg_database"
      options={{ lineNumbers: "off", minimap: { enabled: false } }}
      {...props}
      onMount={(editor, monaco) => {
        if (ref) {
          (ref as MutableRefObject<unknown>).current = editor;
          setEditor(editor);
        }
      }}
    />
  );
});
