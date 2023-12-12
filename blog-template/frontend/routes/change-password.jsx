import { useUser, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link } from "react-router-dom";
import {
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";

export default function () {
  const user = useUser(api);
  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.changePassword, { defaultValues: user });

  return (
    <Center h="100vh">
      {isSubmitSuccessful ? (
        <Text color="green">
          Password changed successfully.{" "}
          <Link to="/signed-in">Back to profile</Link>
        </Text>
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
                Change password
              </Heading>
              <Input
                type="password"
                placeholder="Current password"
                {...register("currentPassword")}
              />
              <Input
                type="password"
                placeholder="New password"
                {...register("newPassword")}
              />
              {errors?.user?.password?.message && (
                <Text color="red">
                  Password: {errors.user.password.message}
                </Text>
              )}
              {errors?.root?.message && (
                <Text color="red">{errors.root.message}</Text>
              )}
              <Link to="/signed-in">
                <Button variant="link">Back to profile</Button>
              </Link>
              <Button disabled={isSubmitting} type="submit">
                Change password
              </Button>
            </Flex>
          </FormControl>
        </form>
      )}
    </Center>
  );
}
