import {
  useGlobalAction,
  useFetch,
  useMaybeFindFirst,
  useActionForm,
} from "@gadgetinc/react";
import { api } from "../api";
import { useState } from "react";
import type { GadgetRecord } from "@gadget-client/ai-screenwriter-template";

type ChatRequestBody = {
  quote: string;
  movie: string;
};

export default function () {
  // see if movie data exists in the database!
  const [
    {
      data: movieDataIngested,
      fetching: checkingIfMovieDataExists,
      error: errorCheckingForData,
    },
    retry,
  ] = useMaybeFindFirst(api.movie);
  // fire action used to ingest data from HuggingFace model
  const [{ fetching: ingestingData, error: errorIngestingData }, ingestData] =
    useGlobalAction(api.ingestData);

  return (
    <main style={{ width: "60vw", position: "absolute", top: 40 }}>
      <div>
        <h1>Make-a-movie scene (with AI)</h1>
        <p>
          Write a fake movie quote, pick a suggested movie, and let OpenAI
          generate a new scene!
        </p>
      </div>

      <br />

      {checkingIfMovieDataExists && <div className="loader"></div>}

      {ingestingData && (
        <div className="row">
          <h2>Fetching movie data...</h2>
        </div>
      )}

      {errorCheckingForData && (
        <p className="error">{errorCheckingForData.message}</p>
      )}

      {errorIngestingData && (
        <p className="error">{errorIngestingData.message}</p>
      )}

      {!movieDataIngested && !checkingIfMovieDataExists && (
        <button
          onClick={async () => {
            await ingestData();
            await retry();
          }}
          disabled={ingestingData}
        >
          Ingest data
        </button>
      )}

      {movieDataIngested && <MovieQuoteForm />}
    </main>
  );
}

const MovieQuoteForm = () => {
  // used to track the reset state of the form
  const [isReset, setIsReset] = useState(true);
  // state for the currently selected movie
  const [movie, setMovie] = useState("");
  // action for finding movies with similar quotes
  const { submit, register, actionData, error, formState, watch, reset } =
    useActionForm(api.findSimilarMovies);

  // watch changes to the quote state in our form, and store in a variable
  const quote = watch("quote");

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await submit();
          setIsReset(true);
        }}
        style={{ maxWidth: "100%" }}
        autoComplete="off"
      >
        <div className="row" style={{ display: "flex" }}>
          <input
            style={{ flex: "1", marginRight: "4px" }}
            placeholder="Enter a fake movie quote! Ex. Here's a toast to you, my dear."
            {...register("quote")}
            disabled={formState.isSubmitting}
          />
          <button
            type="submit"
            disabled={formState.isSubmitting}
            style={{ marginRight: "4px" }}
          >
            Find quotes
          </button>
          <button
            disabled={!formState.isDirty}
            onClick={() => {
              // reset the form
              reset();
              setIsReset(false);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {error && (
        <p className="error">
          There was an error fetching similar movies. Check your Gadget logs for
          more details!
        </p>
      )}
      {actionData?.fetching && <div className="loader"></div>}

      {quote && actionData && isReset && (
        <>
          <div className="row" style={{ textAlign: "left", paddingBottom: 8 }}>
            <b>Movies with similar quotes:</b>
          </div>
          <form>
            <div
              className="row"
              style={{
                display: "flex",
                flexWrap: "wrap",
                textAlign: "left",
                gap: 16,
              }}
            >
              {actionData.map(
                (
                  movieRecord: GadgetRecord<{ id: string; title: string }>,
                  i: number
                ) => (
                  <span key={`movie_option_${i}`}>
                    <input
                      type="radio"
                      checked={movieRecord.title == movie}
                      value={movieRecord.title}
                      onChange={(e) => setMovie(e.target.value)}
                      id={movieRecord.id}
                    />
                    <label htmlFor={movieRecord.id}>{movieRecord.title}</label>
                  </span>
                )
              )}
            </div>
          </form>
        </>
      )}
      {movie && quote && isReset && (
        <SceneGenerator movie={movie} quote={quote} />
      )}
    </>
  );
};

const SceneGenerator = ({ movie, quote }: ChatRequestBody) => {
  // call HTTP route and stream response from OpenAI
  const [{ data, fetching, error }, sendPrompt] = useFetch("/chat", {
    method: "post",
    body: JSON.stringify({ movie, quote }),
    headers: {
      "content-type": "application/json",
    },
    stream: "string",
  });

  return (
    <section>
      <button onClick={() => void sendPrompt()}>Generate scene</button>
      {error && <p className="error">{error.message}</p>}
      {fetching && <div className="loader" />}
      {data && (
        <pre
          style={{
            border: "dashed black 1px",
            background: "#f5f5f5",
            padding: "10px",
            maxHeight: "45vh",
            overflowY: "scroll",
            whiteSpace: "pre-wrap",
            textAlign: "left",
          }}
        >
          {data}
        </pre>
      )}
    </section>
  );
};
