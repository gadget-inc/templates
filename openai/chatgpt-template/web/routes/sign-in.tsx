import GoogleIcon from "../assets/google.svg";
import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link, useLocation } from "react-router-dom";
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
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn);
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
              Sign in
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
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            {errors?.root?.message && (
              <Text color="red">{errors.root.message}</Text>
            )}
            <Button disabled={isSubmitting} type="submit">
              Sign in
            </Button>
            <Text>
              Forgot your password?{" "}
              <Link style={{ textDecoration: "none" }} to="/forgot-password">
                <Button variant="link">Reset password</Button>
              </Link>
            </Text>
          </Flex>
        </FormControl>
      </form>
    </Center>
  );
}
