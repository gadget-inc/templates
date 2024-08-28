import { useActionForm, useAuth } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation, Link } from "react-router-dom";
import {
  Center,
  Text,
  FormControl,
  Input,
  Button,
  Flex,
  Heading,
} from "@chakra-ui/react";

export default function () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const {
    submit,
    register,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.resetPassword, {
    defaultValues: { code: params.get("code") },
  });
  const { configuration } = useAuth();

  return (
    <Center h="100vh">
      {isSubmitSuccessful ? (
        <Text color="green">
          Password reset successfully.{" "}
          <Link to={configuration.signInPath}>Sign in now</Link>
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
                Reset password
              </Heading>
              <Input
                placeholder="New password"
                type="password"
                {...register("password")}
              />
              {errors?.user?.password?.message && (
                <Text color="red">{errors?.user?.password?.message}</Text>
              )}
              <Input
                placeholder="Confirm password"
                type="password"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("password") || "The passwords do not match",
                })}
              />
              {errors?.confirmPassword?.message && (
                <Text color="red">{errors.confirmPassword.message}</Text>
              )}
              {errors?.root?.message && (
                <Text color="red">{errors.root.message}</Text>
              )}
              <Button disabled={isSubmitting} type="submit">
                Reset password
              </Button>
            </Flex>
          </FormControl>
        </form>
      )}
    </Center>
  );
}
