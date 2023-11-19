import { Box, Flex, keyframes, Tooltip } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import { defaultFetcher } from "./defaultFetcher";

export default function StatusIndicator() {
  const { data } = useSWR<{ isConnectionFunctioning: boolean }>(
    "/api/isConnectionFunctioning",
    defaultFetcher,
    {
      refreshInterval: 3000,
    }
  );

  const isActive = data?.isConnectionFunctioning;
  const activeColor = "green.500";
  const inactiveColor = "red.400";
  const ringScaleMin = 0.33;
  const ringScaleMax = 0.66;

  const pulseRing = keyframes`
    0% {
      transform: scale(${ringScaleMin});
    }
    30% {
      transform: scale(${ringScaleMax});
    }
    40%, 50% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
	`;

  const pulseDot = keyframes`
	0% {
    transform: scale(0.9);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(0.9);
  }
	`;

  return (
    <Box
      as="div"
      h="2"
      w="2"
      position="relative"
      bgColor={isActive ? activeColor : inactiveColor}
      borderRadius="50%"
      opacity={0.6}
      _before={{
        content: "''",
        position: "relative",
        display: "block",
        width: "300%",
        height: "300%",
        boxSizing: "border-box",
        marginLeft: "-100%",
        marginTop: "-100%",
        borderRadius: "50%",
        bgColor: isActive ? activeColor : inactiveColor,
        animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
      }}
      _after={{
        animation: `2.25s ${pulseDot} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
      }}
    />
  );
}
