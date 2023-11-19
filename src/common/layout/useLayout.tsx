import React, { useState, useContext } from "react";

// Define the available layout sections as string literals
type LayoutSection = "historySection" | "sqlEditor" | "proAI";

// Define the default layout state as a record with LayoutSection keys and boolean values
export type LayoutState = Record<LayoutSection, boolean>;

// Create a context for the layout state
const LayoutContext = React.createContext<{
  layoutState: LayoutState;
  setLayoutState: React.Dispatch<React.SetStateAction<LayoutState>>;
}>({
  layoutState: {} as LayoutState,
  setLayoutState: () => {},
});

// Define the useLayout hook as a function that returns a boolean value for a given LayoutSection
const useLayout = () => {
  // Get the layout state and setter function from the LayoutContext
  const { layoutState, setLayoutState } = useContext(LayoutContext);

  return {
    layoutState,

    toggleSection: (section: LayoutSection) =>
      setLayoutState((prevState) => ({
        ...prevState,
        [section]: !prevState[section],
      })),
    setSectionState: (section: LayoutSection, state: boolean) =>
      setLayoutState((prevState) => {
        // It does not make sense to have AI on without SQL Editor
        if (section == "proAI" && state == true) {
          return {
            ...prevState,
            proAI: true,
            sqlEditor: true,
          };
        }
        return {
          ...prevState,
          [section]: state,
        };
      }),
  };
};

// Define the LayoutProvider component with children as React.ReactNode and defaultLayout as LayoutState
const LayoutProvider: React.FC<{
  children: React.ReactNode;
  defaultLayout?: LayoutState;
}> = ({ children, defaultLayout }) => {
  // Define the state for the current layout as a LayoutState
  const [layoutState, setLayoutState] = useState<LayoutState>(
    defaultLayout || {
      historySection: true,
      sqlEditor: true,
      proAI: true,
    }
  );
  // Create a value object for the LayoutContext with layoutState and setLayoutState
  const value = {
    layoutState,
    setLayoutState: (arg: LayoutState | ((sl: LayoutState) => LayoutState)) => {
      setLayoutState(arg);
    },
  };

  // Render the LayoutContext.Provider with the value and children
  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export { useLayout, LayoutProvider };
