import {
  Flex,
  Image,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
} from "@chakra-ui/react";
import { useSignOut } from "@gadgetinc/react";

import DefaultUserIcon from "../assets/default-user-icon.svg";
import { LogoutIcon } from "./icons/LogoutIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { KebabIcon } from "./icons/KebabIcon";

import ChatNavItem from "./ChatNavItem";

import { useChat } from "../hooks/useChat";
import { groupByDateBuckets } from "../lib/utils";

const LeftNav = (props) => {
  const { user } = props;
  const signOut = useSignOut();
  const { chats, clearChat } = useChat();

  const groupedChats = groupByDateBuckets(chats, "createdAt");

  return (
    <Flex direction="column" width="260px" bgColor="gray.900">
      <Flex direction="column" flex="1" pt={2} px={3} gap={4}>
        <Button
          variant="outline"
          borderColor="white"
          borderRadius="md"
          borderWidth="1px"
          p={2}
          gap={3}
          _hover={{ bgColor: "gray.600" }}
          onClick={clearChat}
        >
          <PlusIcon />
          <Text color="white">New Chat</Text>
        </Button>
        {Object.entries(groupedChats).map(([dateGroup, chatGroup]) => (
          <Flex key={dateGroup} direction="column" gap={1}>
            <Text fontSize="xs" color="gray.400">
              {dateGroup}
            </Text>
            {chatGroup.map((chat) => (
              <ChatNavItem key={chat.id} chat={chat} />
            ))}
          </Flex>
        ))}
      </Flex>
      <Flex mx={1} p={3} borderTopWidth="1px" borderTopColor="gray.700">
        <Popover>
          <PopoverTrigger>
            <Button
              display="flex"
              flex="1"
              justifyContent="space-between"
              p={3}
              borderRadius="md"
              variant="link"
              _hover={{ bgColor: "gray.600" }}
            >
              <Flex gap={3} alignItems="center">
                <Image
                  src={user.googleImageUrl || DefaultUserIcon}
                  boxSize={6}
                />
                <Text color="white" fontSize="sm">
                  {user.email}
                </Text>
              </Flex>
              <KebabIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent background="none" border="none">
            <PopoverBody>
              <Flex bgColor="black" width="252px" borderRadius="md" py={2}>
                <Button
                  display="flex"
                  flex="1"
                  py={2}
                  px={4}
                  justifyContent="flex-start"
                  _hover={{ bgColor: "gray.600" }}
                  gap={3}
                  variant="link"
                  onClick={signOut}
                >
                  <LogoutIcon />
                  <Text color="white" fontSize="sm">
                    Log out
                  </Text>
                </Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  );
};

export default LeftNav;
