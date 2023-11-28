import type { HistoryRecord } from "@/common/appData";
import { defaultFetcher } from "@/common/defaultFetcher";
import {
  TextProps,
  Tooltip,
  IconButton,
  IconProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { getRelativeDate } from "@/common/dateFormatter";
import useSWR, { mutate as mutateGlobal } from "swr";
import { useEditor } from "@/common/hooks/useEditor";
import { useRef, useState } from "react";
import { css } from "@emotion/css";
import { SectionHeading } from "@/common/layout/SectionHeading";
import { colors } from "@/common/colors";
import { SpacerVertical } from "@/common/Spacer";

export const HistorySection = () => {
  return (
    <>
      <SectionHeading mt={1}>History</SectionHeading>
      <SpacerVertical size={2} />
      <Tabs position="relative" variant="line">
        <TabList>
          <Tab flexShrink={0}>Current connection</Tab>
          <Tab flexShrink={0} flexGrow={1}>
            All
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <SpacerVertical size={10} />

            <CurrentConnectionistorySection />
          </TabPanel>
          <TabPanel p={0}>
            <SpacerVertical size={10} />

            <AllHistorySection />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
const CurrentConnectionistorySection = () => {
  const { data: history, error } = useSWR<HistoryRecord[]>(
    "/api/history/list?forCurrentConnection=true",
    defaultFetcher
  );
  return (
    <>
      {history?.map((record, i) => (
        <HistoryItem record={record} key={record.createdAt} />
      ))}
    </>
  );
};
const AllHistorySection = () => {
  const { data: history, error } = useSWR<HistoryRecord[]>(
    "/api/history/list",
    defaultFetcher
  );
  return (
    <>
      {history?.map((record, i) => (
        <HistoryItem record={record} key={record.createdAt} />
      ))}
    </>
  );
};

const HistoryRelativeDate = ({
  date,
  ...props
}: { date: string } & TextProps) => {
  return (
    <span
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        fontSize: "14px",
        color: colors.gray500,
      })}
    >
      <time dateTime={date} title={date.split("T").join("  ")}>
        {getRelativeDate(new Date(date))}
      </time>
    </span>
  );
};

const VerticalDotsIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={css({
      width: "1em",
      height: "1em",
      display: "inline-block",
      lineHeight: "1em",
      flexShrink: 0,
      verticalAlign: "middle",
    })}
  >
    <path
      fillRule="evenodd"
      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
      clipRule="evenodd"
    />
  </svg>
);

const HistoryItem = ({ record }: { record: HistoryRecord }) => {
  const { editor } = useEditor();
  const [inEditMode, setInEditMode] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const save = () => {
    if (inputRef.current) {
      const newName = inputRef.current.value;
      if (newName !== record.name) {
        fetch("/api/history/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            createdAt: record.createdAt,
            name: newName,
          }),
        }).then(() => {
          mutateGlobal("/api/history/list");
          mutateGlobal("/api/history/list?forCurrentConnection=true");
        });
      }
    }
  };
  const deleteRecord = () => {
    fetch("/api/history/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        createdAt: record.createdAt,
      }),
    }).then(() => {
      mutateGlobal("/api/history/list");
      mutateGlobal("/api/history/list?forCurrentConnection=true");
    });
  };

  return (
    <div
      className={css({
        display: "flex",
      })}
    >
      <Tooltip
        placement="left"
        hasArrow
        bg="gray.50"
        color="gray.900"
        label={
          <pre
            className={css({
              fontSize: "0.75rem",
              minWidth: "250px",
              maxWidth: "750px",
              minHeight: "64px",
              maxHeight: "900px",
              overflow: "auto",
              padding: "0.5rem",
            })}
          >
            {record.query}
          </pre>
        }
      >
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
            cursor: "pointer",
            "&:hover": {
              bg: colors.gray50,
              borderLeftColor: colors.gray200,
            },
            borderLeftWidth: "4px",
            borderLeftColor: "transparent",
            padding: "6px 8px",
            flex: 1,
          })}
          onClick={() => {
            const fullModelRange = editor?.getModel()?.getFullModelRange();
            // Replace the editor content
            fullModelRange &&
              editor?.getModel()?.pushEditOperations(
                [],
                [
                  {
                    range: fullModelRange,
                    text: record.query,
                  },
                ],
                () => null
              );
          }}
        >
          <input
            defaultValue={record.name}
            className={css({
              border: "none",
              fontSize: "1rem",
              color: colors.gray900,
              background: "transparent",
              width: "100%",
              display: inEditMode ? "default" : "none",
              "&:focus": {
                border: "none",
                outline: "none",
              },
            })}
            ref={inputRef}
            // on Esc cancel edit
            // on Enter save
            // on blur save

            onBlur={() => {
              setInEditMode(false);
              save();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
                e.currentTarget.value = record.name?.trim() || "Untitled";
                setInEditMode(false);
              }
              if (e.key === "Enter") {
                e.currentTarget.blur();
                save();
                setInEditMode(false);
              }
            }}
          ></input>

          <div
            className={css({
              display: inEditMode ? "none" : "default",
              cursor: "",
            })}
          >
            {record.name ?? "Untitled"}
          </div>

          <HistoryRelativeDate
            date={record.lastExecutedAt || record.createdAt}
            ml={2}
          />
        </div>
      </Tooltip>
      <Menu>
        <MenuButton
          zIndex="dropdown"
          as={IconButton}
          my={1.5}
          variant={"ghost"}
          aria-label="More"
          size="sm"
          icon={<VerticalDotsIcon fontSize={"md"} />}
          mr={2}
        />
        <MenuList zIndex="dropdown">
          <MenuItem
            onClick={() => {
              setInEditMode(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
          >
            Rename
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteRecord();
            }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};
