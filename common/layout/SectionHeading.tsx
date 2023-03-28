import { css } from "@emotion/css";

export const SectionHeading = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => {
  return (
    <h2
      className={css({
        lineHeight: "1.2",
        fontSize: "1.25rem",
        padding: "12px 16px",
        margin: 0,
        fontWeight: "bold",
      })}
      {...props}
    >
      {children}
    </h2>
  );
};
