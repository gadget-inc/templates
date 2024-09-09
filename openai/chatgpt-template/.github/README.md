# ChatGPT clone

The application is a template designed to showcase how a chatbot can be built using Gadget, integrated with OpenAI. It manages user authentication, chat data, and messages, allowing users to create and interact with chat sessions through a streamlined interface.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=chatgpt-template.gadget.app)

## Key features

- Models

  - Chat: Stores chat data, including messages, the user it belongs to, and other related information.
    - Actions
      - `name`: Generates a chat name using the first message sent.
  - Message: Stores messages, associating them with chats and ordering them appropriately.
  - User: Tracks user authentication and manages chats and email verification.

- Frontend

  - `App.jsx`: Handles routing for the application's frontend.
  - `Chat.jsx`: Displays the logged-in view of the app.
  - `CurrentChat.jsx`: Builds and displays the current chat within the chat view.
  - `index.jsx`: Serves as the unauthenticated landing page.
