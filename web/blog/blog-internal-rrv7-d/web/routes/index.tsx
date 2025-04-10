import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import Post from "@/components/Post";
import { useFindMany } from "@gadgetinc/react";
import { api } from "@/api";

export default function () {
  const [{ data: posts, fetching, error }] = useFindMany(api.post, {
    select: {
      title: true,
      content: {
        html: true,
      },
      updatedAt: true,
      author: true,
    },
  });

  if (fetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
  }

  return (
    <main className="flex-1 overflow-y-auto flex justify-center">
      <div className="container mx-auto px-6 py-8 flex justify-center items-center max-w-4xl">
        <div className="flex flex-col gap-8 w-full">
          {posts?.length ? (
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
            <div className="w-full min-h-[200px] flex flex-col justify-center items-center p-8 text-center">
              Login to create a post! Note that you need to publish posts to see
              them on this page.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
