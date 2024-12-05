import GoogleIcon from "../assets/google.svg";
import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation } from "react-router-dom";
import {
  FormControl,
  Button,
  Heading,
  Flex,
  Input,
  Text,
  Center,
} from "@chakra-ui/react";

export default function () {
  const {
    register,
    submit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.signUp);
  const { search } = useLocation();

  return (
    <Center h="100vh">
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
              Create account
            </Heading>
            <Button
              as="a"
              href={`/auth/google/start${search}`}
              gap="8px"
              w="100%"
            >
              <img src={GoogleIcon} width={22} height={22} />
              Continue with Google
            </Button>
            <Input placeholder="Email" {...register("email")} />
            {errors?.user?.email?.message && (
              <Text color="red">Email: {errors.user.email.message}</Text>
            )}
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            {errors?.user?.password?.message && (
              <Text color="red">Password: {errors.user.password.message}</Text>
            )}
            {errors?.root?.message && (
              <Text color="red">{errors.root.message}</Text>
            )}
            {isSubmitSuccessful && (
              <Text color="green">Please check your inbox</Text>
            )}
            <Button disabled={isSubmitting} type="submit">
              Sign up
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Center>
  );
}
