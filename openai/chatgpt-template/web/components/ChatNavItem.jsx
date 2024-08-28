import { Flex, Text, Button, Spinner } from "@chakra-ui/react";
import { ChatIcon } from "./icons/ChatIcon";
import { TrashIcon } from "./icons/TrashIcon";
import { useChat } from "../hooks/useChat";

const ChatNavItem = (props) => {
  const { chat } = props;
  const { currentChat, selectChat, deleteChat } = useChat();

  return (
    <Flex
      justifyContent="space-between"
      borderRadius="md"
      p={2}
      bgColor={chat.id === currentChat?.id ? "gray.600" : undefined}
      _hover={{ bgColor: "gray.600", cursor: "pointer" }}
      onClick={() => {
        selectChat(chat);
      }}
    >
      <Flex gap={3}>
        <ChatIcon />
        <Text color="white">{chat.name ?? "New chat"}</Text>
      </Flex>
      <Button
        color="gray.300"
        variant="link"
        _hover={{ color: "white" }}
        onClick={async (event) => {
          event.stopPropagation();

          await deleteChat(chat);
        }}
      >
        <TrashIcon />
      </Button>
    </Flex>
  );
};

export default ChatNavItem;
