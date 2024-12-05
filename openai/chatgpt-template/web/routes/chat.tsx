import { Flex, Heading } from "@chakra-ui/react";
import { useUser } from "@gadgetinc/react";
import CurrentChat from "../components/CurrentChat";
import LeftNav from "../components/LeftNav";
import { api } from "../api";
import type { User } from "@gadget-client/chatgpt-template";

export default function () {
  const user = useUser(api) as any as User;

  return user ? (
    <Flex height="100vh" width="100vw" overflow="hidden" alignSelf="stretch">
      <LeftNav user={user} />
      <Flex direction="column" flex="1">
        <Flex
          py={4}
          mx={16}
          justifyContent="center"
          borderBottomWidth="1px"
          borderBottomColor="rgba(255,255,255,0.2)"
        >
          <Heading as="h1" size="xs" color="white">
            Gadget x ChatGPT
          </Heading>
        </Flex>
        <CurrentChat user={user} />
      </Flex>
    </Flex>
  ) : null;
}
