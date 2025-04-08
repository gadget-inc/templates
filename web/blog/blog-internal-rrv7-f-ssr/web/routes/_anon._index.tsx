import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Route } from "./+types/_anon._index";
import Post from "@/components/Post";

export const loader = async ({ context }: Route.LoaderArgs) => {
  return {
    posts: await context.api.post.findMany({
      select: {
        title: true,
        content: {
          html: true,
        },
        updatedAt: true,
        author: true,
      },
    }),
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
            {/* We recommend removing this once going live. It's meant for internal use only */}
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto flex justify-center">
          <div className="container mx-auto px-6 py-8 flex justify-center items-center max-w-4xl">
            <div className="flex flex-col gap-8 w-full">
              {posts.length ? (
                posts.map(({ title, content, updatedAt, author }, index) => (
                  <Post
                    key={`post-${index}-${title}`}
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
