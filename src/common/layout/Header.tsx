import { css, cx } from "@emotion/css";
import { colors } from "../colors";
import { SpacerHorizontal } from "../Spacer";
import { useLayout } from "./useLayout";
import useSWR from "swr";
import { defaultFetcher } from "../defaultFetcher";
import StatusIndicator from "../StatusIndicator";
import { chakra } from "@chakra-ui/react";
const DOMAIN = "https://db-ray.pro";

export const Header = () => {
  const { layoutState, setSectionState } = useLayout();
  // ProApiKeyStatus type
  type ProApiKeyStatus = "active" | "inactive" | "expired";
  const { data, error } = useSWR<{ status: ProApiKeyStatus }>(
    "/api/pro/checkProStatus",
    defaultFetcher
  );

  return (
    <chakra.header
      gridArea={"header"}
      zIndex={10}
      borderBottomColor={"gray.100"}
      borderBottomWidth={1}
      display={"flex"}
      alignItems={"center"}
    >
      <chakra.a href="/" display="flex" alignItems="center">
        <h1
          className={css({
            fontFamily:
              'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;',
            fontWeight: "bold",
            fontSize: "30px",
            lineHeight: "36px",
            marginLeft: "16px",
            padding: "6px 16px",
            color: "#718096",
            backgroundColor: "#f7fafc",
            borderRadius: "8px",
            // inset
            boxShadow: "inset 0 2px 4px 0 rgba(0,0,0,0.06);",
            cursor: "pointer",
          })}
        >
          db-ray
        </h1>
      </chakra.a>
      <div
        className={css({
          marginLeft: "70px",
          display: "flex",
          alignItems: "baseline",
        })}
      >
        {/* <p>Views:</p>
        <SpacerHorizontal size={16} />
        <BadgeAsWithCheckBox
          label="SQL editor"
          active={layoutState.sqlEditor}
          onSetActive={(active) => setSectionState("sqlEditor", active)}
        />
        <SpacerHorizontal size={12} />
        <BadgeAsWithCheckBox
          label="Query history"
          active={layoutState.historySection}
          onSetActive={(active) => setSectionState("historySection", active)}
        /> */}
        {/* {data?.status === "active" ? (
          <>
            <SpacerHorizontal size={12} />
            <BadgeAsWithCheckBox
              label="PRO AI ✨"
              active={layoutState.proAI}
              onSetActive={(active) => setSectionState("proAI", active)}
            />
          </>
        ) : null} */}
        {data?.status && data?.status !== "active" ? (
          <a
            href={`${DOMAIN}/link`}
            target="_blank"
            className={css({
              display: "flex",
              alignItems: "baseline",
              padding: "8px 16px",
              marginLeft: 16,
              fontWeight: "bold",
              color: colors.blue500,
              opacity: 0.6,
              borderRadius: "8px",
              ".hoverable": {
                opacity: 0,
              },
              ":hover": {
                color: colors.blue600,
                textDecoration: "underline",
                opacity: 1,
                ".hoverable": {
                  opacity: 1,
                },
              },
            })}
          >
            ⭐ Get AI assistance
            <span
              className="hoverable"
              style={{
                marginLeft: 4,
              }}
            >
              <ExternalLinkIcon />
            </span>
          </a>
        ) : null}
      </div>
      <div
        className={css({
          marginLeft: "auto",
          marginRight: "16px",
          display: "flex",
          alignItems: "baseline",
        })}
      >
        <a
          href="/connect"
          className={css({
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            backgroundColor: "#f7fafc",
            borderRadius: "4px",
            ":hover": {
              backgroundColor: "#edf2f7",
            },
          })}
        >
          <StatusIndicator />
          <SpacerHorizontal size={12} />
          Change connection
        </a>
      </div>
    </chakra.header>
  );
};

interface BadgeProps {
  label: string;
  active?: boolean;
  onSetActive?: (active: boolean) => void;
}

const badgeClass = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "26px",
  fontSize: "14px",
  padding: "4px 12px",
  borderRadius: "16px",
  color: "#020202",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: colors.gray100,
  ":hover": {
    backgroundColor: colors.gray200,
  },
});
const activeBadgeClass = css({
  backgroundColor: colors.blue100,
  color: "#020202",
  ":hover": {
    backgroundColor: colors.blue200,
  },
});
const checkboxClass = css({
  display: "none",
});

const BadgeAsWithCheckBox = ({ label, active, onSetActive }: BadgeProps) => {
  return (
    <label
      className={cx({ [badgeClass]: true }, { [activeBadgeClass]: active })}
      data-active={active}
    >
      <input
        className={checkboxClass}
        type="checkbox"
        checked={active}
        onChange={
          onSetActive
            ? (e) => {
                onSetActive(e.target.checked);
              }
            : undefined
        }
      />
      {label}
    </label>
  );
};

export const ExternalLinkIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      className={css({
        width: "1em",
        height: "1em",
        lineHeight: "1em",
        verticalAlign: "middle",
        display: "inline-block",
      })}
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <path d="M15 3h6v6"></path>
        <path d="M10 14L21 3"></path>
      </g>
    </svg>
  );
};
