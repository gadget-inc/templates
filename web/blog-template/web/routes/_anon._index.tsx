import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import { Route } from "./+types/_anon._index";

type PostProps = {
  title: string;
  content: {
    html: string;
  } | null;
  updatedAt: Date;
  author: string | null;
};

const Post = ({ title, content, updatedAt, author }: PostProps) => {
  console.log({ title, content, updatedAt, author });

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Updated: {updatedAt.toDateString()}</CardDescription>
        </div>
        <div>By: {author}</div>
      </CardHeader>
      <CardContent>
        <div
          dangerouslySetInnerHTML={{
            __html: content?.html || "",
          }}
        />
      </CardContent>
    </Card>
  );
};

export const loader = async ({ context }: Route.LoaderArgs) => {
  const posts = await context.api.post.findMany({
    select: {
      title: true,
      content: {
        html: true,
      },
      updatedAt: true,
      author: true,
    },
  });

  console.log({ posts });

  return {
    posts,
  };
};

export default function ({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background w-screen">
          <Link to="/" className="flex items-center">
            <img
              src="/api/assets/autologo?background=dark"
              alt="App name"
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex gap-4">
            <Button variant="default" size="lg" className="w-full" asChild>
              <Link to="/sign-up">Sign up</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col gap-4">
              {posts ? (
                posts.map(({ title, content, updatedAt, author }) => (
                  <Post
                    {...{
                      title,
                      content,
                      updatedAt,
                      author: String(author),
                    }}
                  />
                ))
              ) : (
                <div>
                  Login to create a post! Note that you need to publish posts to
                  see them on this page.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
