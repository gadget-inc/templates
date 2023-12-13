import { IngestDataGlobalActionContext } from "gadget-server";

/**
 * @param { IngestDataGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  // use Node's fetch to make a request to https://huggingface.co/datasets/ygorgeurts/movie-quotes
  const response = await fetch(
    "https://datasets-server.huggingface.co/first-rows?dataset=ygorgeurts%2Fmovie-quotes&config=default&split=train",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const responseJson = await response.json();

  // log the response
  logger.info({ responseJson }, "here is a sample of movies returned from hugging face");

  if (responseJson?.rows) {
    // get the data in our record's format
    const movies = responseJson.rows.map((movie) => ({ title: movie.row.movie, quote: movie.row.quote, embedding: [] }));
    // also get input data for the OpenAI embeddings API
    const input = responseJson.rows.map((movie) => `${movie.row.movie} from the movie ${movie.row.quote}`);
    const embeddings = await connections.openai.embeddings.create({
      input,
      model: "text-embedding-ada-002",
    });
    // append embeddings to movies
    embeddings.data.forEach((movieEmbedding, i) => {
      movies[i].embedding = movieEmbedding.embedding;
    });

    // use the internal API to bulk create movie records
    await api.internal.movie.bulkCreate(movies);
  }
}