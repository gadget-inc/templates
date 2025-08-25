# AI Screenwriter

## Core purpose

This template is a great starting point to build AI applications. It comes pre-configured with an OpenAI connection, allowing you to quickly build features like automated script writing, character dialogue generation, or any other creative writing task.

## Key functionality

- **AI-powered content generation**: Leverages a built-in OpenAI connection to generate movie scripts, quotes, and other creative text based on user prompts.
- **Real-time streaming**: Includes an example of how to stream AI responses directly to the frontend, providing a dynamic and interactive user experience.
- **Semantic search-ready**: The `movie` model includes a vector field for `embedding`, laying the groundwork for building a semantic search feature to find similar movies based on their quotes or titles.

## Key features

- Models

  - `movie`: Stores movie titles, quotes, and vector embeddings
  - User: Manages signups and user information.

- Global actions:

  - `ingestData`: Fetches movie data from Hugging Face, sends it to OpenAI for embeddings, and stores the results.
  - `findSimilarMovies`: Uses a user-submitted quote to find similar quotes from the database and generates screenplay suggestions based on vector embeddings.

- Routes

  - `POST-chat`: Streams responses from the OpenAI API to the client.

- Frontend

  - `App.jsx`: Manages routing for the application's frontend.
