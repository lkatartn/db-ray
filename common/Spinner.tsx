import { css } from "@emotion/css";

export const Spinner = () => {
  return (
    <svg
      className={css({
        width: "1.5em",
        height: "1.5em",
        display: "inline-block",
        lineHeight: "1.5em",
        flexShrink: 0,
        verticalAlign: "middle",
        fontSize: "0.67rem",
      })}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
        className="spinner_aj0A"
        fill="currentColor"
      />
    </svg>
  );
};

export const StillSpinner = () => {
  return (
    <svg
      className={css({
        width: "1.5em",
        height: "1.5em",
        display: "inline-block",
        lineHeight: "1.5em",
        flexShrink: 0,
        verticalAlign: "middle",
        fontSize: "0.67rem",
      })}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M8 1a7 7 0 0 1 7 7h-1.5a5.5 5.5 0 1 0-.009 5.5A5.5 5.5 0 0 0 12.5 9H11v4l4-4-4-4v3h1.5A7 7 0 0 1 8 1z"
      />
    </svg>
  );
};
