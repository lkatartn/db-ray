import { css } from "@emotion/css";

export const SpacerHorizontal = (props: { size: number }) => {
  return (
    <div className={css({ width: props.size, display: "inline-block" })} />
  );
};

export const SpacerVertical = (props: { size: number }) => {
  return <div className={css({ height: props.size, display: "block" })} />;
};
