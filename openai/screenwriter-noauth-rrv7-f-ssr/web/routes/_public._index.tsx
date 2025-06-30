import { api } from "@/api";
import { AutoButton, AutoForm, AutoInput, AutoSubmit } from "@/components/auto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "./+types/_public._index";
import { useState } from "react";
import { useFetch } from "@gadgetinc/react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const loader = async ({ context }: Route.LoaderArgs) => {
  const exists = await context.api.actAsAdmin.movie.maybeFindFirst();

  return {
    exists: !!exists,
  };
};

export default function ({ loaderData }: Route.ComponentProps) {
  const [hideGettingStarted, setHideGettingStarted] = useState(
    loaderData.exists
  );
  const [quote, setQuote] = useState<string>("");
  const [options, setOptions] = useState<{ id: string; title: string }[]>([]);
  const [choice, setChoice] = useState<string>("");

  const [{ data: script, fetching, error: errorFetchingScript }, sendPrompt] =
    useFetch("/chat", {
      method: "post",
      body: JSON.stringify({ choice, quote }),
      headers: {
        "content-type": "application/json",
      },
      stream: "string",
    });

  if (!hideGettingStarted) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Getting started
          </CardTitle>
        </CardHeader>
        <CardContent>
          Before you can start creating scenes, you must first ingest some move
          data.
        </CardContent>
        <CardContent>
          <AutoButton
            action={api.fetchMovies}
            title=""
            onSuccess={() => setHideGettingStarted(true)}
          >
            Fetch movies
          </AutoButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Make-a-movie scene (with AI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AutoForm
            title=""
            action={api.findSimilarMovies}
            onSuccess={(result) => {
              setQuote(result.quote);
              setOptions(result.options);
            }}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row items-end gap-4 w-full">
              <div className="flex-grow w-full sm:min-w-[75%]">
                <AutoInput field="quote" />
              </div>
              <AutoSubmit className="w-full sm:w-auto mt-2 sm:mt-0">
                Find movies
              </AutoSubmit>
            </div>
          </AutoForm>
        </CardContent>
      </Card>
      {!!options.length && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Choose a movie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={choice}
              onValueChange={setChoice}
              className="space-y-1"
            >
              {options.map((option, i) => (
                <div
                  key={i}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    option.title === choice
                      ? "bg-secondary/50 border-secondary"
                      : "hover:bg-muted"
                  }`}
                >
                  <RadioGroupItem value={option.title} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="font-medium cursor-pointer"
                  >
                    {option.title}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}
      {errorFetchingScript && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error generating scene</AlertTitle>
          <AlertDescription>{errorFetchingScript.toString()}</AlertDescription>
          <Button
            onClick={() => sendPrompt()}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Try again
          </Button>
        </Alert>
      )}

      {script && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Generated</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="border border-dashed border-border bg-muted p-4 rounded-md max-h-[45vh] overflow-y-auto whitespace-pre-wrap text-left text-sm">
              {script}
            </pre>
          </CardContent>
        </Card>
      )}
      {choice && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => sendPrompt()}
            disabled={!choice || fetching}
            size="lg"
            className="w-full md:w-auto"
          >
            {fetching ? "Generating..." : "Generate scene"}
          </Button>
        </div>
      )}
    </div>
  );
}
