import type {
  GadgetRecord,
  Movie,
} from "@gadget-client/screenwriter-noauth-rrv7-f-ssr";

type HuggingFaceMovie = {
  row: {
    movie: string;
    quote: string;
    type: string;
    year: number;
  };
  row_idx: number;
  truncated_cells: any[];
  embedding: number[];
};

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const response = await fetch(
    "https://datasets-server.huggingface.co/first-rows?dataset=ygorgeurts%2Fmovie-quotes&config=default&split=train",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const responseJson = await response.json();

  if (responseJson?.rows) {
    // get the data in our record's format
    const movies: GadgetRecord<Movie>[] = responseJson.rows.map(
      (movie: HuggingFaceMovie) => ({
        title: movie.row.movie,
        quote: movie.row.quote,
        embedding: [],
      })
    );

    // also get input data for the OpenAI embeddings API
    const input: string[] = responseJson.rows.map(
      (movie: HuggingFaceMovie) =>
        `${movie.row.quote}, from the movie ${movie.row.movie}`
    );

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
};
