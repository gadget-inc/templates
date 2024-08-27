import { Link } from "react-router-dom";
import { Flex, Button, Heading } from "@chakra-ui/react";

export default function () {
  return (
    <Flex
      direction="column"
      height="100vh"
      width="100vw"
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
      gap="12px"
    >
      <Heading as="h1" size="lg">
        Gadget x ChatGPT
      </Heading>
      <Link to="/sign-up">
        <Button variant="solid">Sign up</Button>
      </Link>
      <Link to="/sign-in">Sign in</Link>
    </Flex>
  );
}
