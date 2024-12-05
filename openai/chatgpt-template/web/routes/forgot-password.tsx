import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Button, Center, Input, Text, Heading, Flex, FormControl } from "@chakra-ui/react";

export default function () {
  const {
    submit,
    register,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendResetPassword);

  return (
    <Center h="100vh">
      {isSubmitSuccessful ? (
        <Text color="green">Email has been sent. Please check your inbox.</Text>
      ) : (
        <form style={{ width: "100%" }} onSubmit={submit}>
          <FormControl w="100%" display="flex" justifyContent="center">
            <Flex
              direction="column"
              maxW="350px"
              w="100%"
              gap="16px"
              align="center"
            >
              <Heading as="h1" size="md">
                Reset password
              </Heading>
              <Input
                placeholder="Email"
                {...register("email")}
              />
              <Button disabled={isSubmitting} w="100%" type="submit">
                Send reset link
              </Button>
            </Flex>
          </FormControl>
        </form>)
      }
    </Center>
  );
}
