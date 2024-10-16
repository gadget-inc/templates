# AI Screenwriter

The application "Screenwriter GPT" is a template designed to generate fake movie scenes based on user-entered quotes, using the built-in OpenAI connection. It stores movie titles and quotes fetched from the Hugging Face dataset, alongside vector embeddings produced by the OpenAI API. The app also manages user signups and information.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=ai-screenwriter-template.gadget.app)

## Key features

- Models

  - Movie: Stores movie titles, quotes, and vector embeddings
  - User: Manages signups and user information.

- Global actions:

  - `ingestData`: Fetches movie data from Hugging Face, sends it to OpenAI for embeddings, and stores the results.
  - `findSimilarMovies`: Uses a user-submitted quote to find similar quotes from the database and generates screenplay suggestions based on vector embeddings.

- Routes

  - `POST-chat`: Streams responses from the OpenAI API to the client.

- Frontend

  - `App.jsx`: Manages routing for the application's frontend.
