export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { quote } = params;

  // throw an error if a quote wasn't passed in
  if (!quote) {
    throw new Error("Missing quote!");
  }

  // create an embedding from the entered quote
  const response = await connections.openai.embeddings.create({
    input: quote,
    model: "text-embedding-ada-002",
  });

  // get the 4 most similar movies that match your quote, and return them to the frontend
  const movies = await api.movie.findMany({
    sort: {
      embedding: {
        cosineSimilarityTo: response.data[0].embedding,
      },
    },
    first: 4,
    select: {
      id: true,
      title: true,
    },
  });

  // remove duplicates
  const options = movies.filter(
    (movie, index) => movies.findIndex((m) => m.title === movie.title) === index
  );

  return { options, quote };
};

export const params = {
  quote: { type: "string" },
};
