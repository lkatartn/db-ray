import { useState } from "react";
import {
  Flex,
  Box,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  chakra,
  useColorModeValue,
  Grid,
  Divider,
  FormControl,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { parse } from "@/common/utils/urlParser";
import { Spinner } from "@/common/Spinner";

export default function Connect() {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={[0, 6]}
        w={["full", "auto"]}
      >
        <Stack align={"center"} px={[6, 0]}>
          <Heading fontSize={["2xl", "4xl"]}>Connect to the database</Heading>
        </Stack>
        <chakra.form
          rounded={["none", "lg"]}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          onSubmit={(e) => {
            e.preventDefault();
            setErrorText(null);
            setConnecting(true);
            const formData = new FormData(e.currentTarget);
            const { connectionString, ...otherData } = Object.fromEntries(
              formData.entries()
            );

            fetch("/api/setConnection", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                connectionName: "default",
                connectionConfig:
                  connectionString !== "" ? connectionString : otherData,
              }),
            }).then((r) => {
              setConnecting(false);
              if (r.status === 200) {
                try {
                  const dbName =
                    connectionString !== ""
                      ? parseSqlConnectionUrl(connectionString as string)
                          .database
                      : otherData.database;
                  window.location.href = "/" + dbName;
                } catch (e) {
                  window.location.href = "/";
                }
              } else {
                r.json().then((r) => setErrorText(JSON.stringify(r, null, 2)));
              }
            });
          }}
        >
          <Grid
            gridTemplateColumns={[
              "1fr",
              "minmax(auto, 100px) minmax(200px, 300px)",
            ]}
            rowGap={[2, 5]}
            alignItems="center"
          >
            <chakra.label mt={[2, 1]} htmlFor="host">
              Host
            </chakra.label>
            <Input
              type="text"
              name="host"
              id="host"
              defaultValue={"localhost"}
              autoComplete="off"
            />

            <chakra.label mt={[2, 1]} htmlFor="port">
              Port
            </chakra.label>
            <Input
              type="text"
              name="port"
              defaultValue={"5432"}
              id="port"
              autoComplete="off"
            />

            <chakra.label mt={[2, 1]} htmlFor="user">
              User
            </chakra.label>
            <Input type="text" name="user" id="user" autoComplete="off" />

            <chakra.label mt={[2, 1]} htmlFor="password">
              Password
            </chakra.label>
            <Input
              type="password"
              name="password"
              id="password"
              autoComplete="off"
            />

            <chakra.label mt={[2, 1]} htmlFor="database">
              Database
            </chakra.label>
            <Input
              type="text"
              name="database"
              id="database"
              autoComplete="off"
            />
          </Grid>
          <Flex alignItems={"center"} mt={6} mb={4}>
            <Box flex="1">
              <Divider />
            </Box>
            <Text mx="4">or</Text>
            <Box flex="1">
              <Divider />
            </Box>
          </Flex>
          <FormControl mt={0}>
            <FormLabel htmlFor="connectionString" fontWeight={"normal"}>
              Connection String
            </FormLabel>
            <Input
              type="text"
              name="connectionString"
              id="connectionString"
              autoComplete="off"
            />
          </FormControl>

          <Button
            w="100%"
            maxWidth={["full", "md"]}
            type="submit"
            mt={8}
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
          >
            {connecting ? (
              <>
                <chakra.span mr="3.5">Connecting </chakra.span>
                <Spinner />
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </chakra.form>
        {errorText ? (
          <Flex borderColor={"red.100"} borderWidth={1} flexDirection="column">
            <IconButton
              aria-label="close error"
              icon={<CloseIcon />}
              onClick={() => setErrorText(null)}
              size="xs"
              variant={"ghost"}
              marginLeft="auto"
              borderRadius={"0px"}
              alignSelf="flex-end"
              colorScheme={"red"}
            ></IconButton>
            <chakra.pre fontSize="0.75rem" alignSelf={"stretch"} px={6} pb={6}>
              {errorText}
            </chakra.pre>
          </Flex>
        ) : null}
      </Stack>
    </Flex>
  );
}

function parseSqlConnectionUrl(connectionString: string) {
  const url = parse(connectionString);

  return {
    server: url.hostname,
    database: url.pathname.slice(1), // remove the leading '/'
    user: url.auth?.split(":")[0],
    password: url.auth?.split(":")[1],
    port: url.port,
  };
}
