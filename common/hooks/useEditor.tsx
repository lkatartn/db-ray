import {
  useState,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
} from "react";
import { editor } from "monaco-editor";

const EditorContext = createContext<{
  editor: editor.IStandaloneCodeEditor | null;
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
}>({ editor: null, setEditor: () => {} });

export const EditorProvider = ({ children }: PropsWithChildren) => {
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null
  );

  const providerData = useMemo(
    () => ({
      editor,
      setEditor,
    }),
    [editor]
  );

  return (
    <EditorContext.Provider value={providerData}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const editor = useContext(EditorContext);
  return editor;
};
