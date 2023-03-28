//import react context api
import { useContext, createContext } from "react";

export interface ViewLayoutContextValue {
  isRawOutputVisible: boolean;
  isAIPromptVisible: boolean;
}

const viewLayoutContext = createContext<ViewLayoutContextValue>({
  isRawOutputVisible: false,
  isAIPromptVisible: false,
});

export const useViewLayout = () => {
  return useContext(viewLayoutContext);
};

export const ViewLayoutProvider = viewLayoutContext.Provider;
