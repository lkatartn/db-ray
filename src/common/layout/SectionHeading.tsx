import { chakra, OtherProps } from "@chakra-ui/react";
import { css } from "@emotion/css";

export const SectionHeading = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<
  React.HTMLAttributes<HTMLHeadingElement> & { mt?: number }
>) => {
  return (
    <chakra.h2
      className={css({
        lineHeight: "1.2",
        fontSize: "0.85rem",
        letterSpacing: "0.05rem",
        padding: "10px 16px",
        margin: 0,
        fontWeight: "bold",
      })}
      color="gray.400"
      textTransform={"uppercase"}
      {...props}
    >
      {children}
    </chakra.h2>
  );
};
