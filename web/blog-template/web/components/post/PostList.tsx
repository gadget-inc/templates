import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { useAction } from "@gadgetinc/react";
import { api } from "@/api";

type Post = {
  id: string;
  title: string;
  updatedAt: Date;
};

type PostProps = {
  post: Post;
  selectedPostId?: string;
  setSelectedPostId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

type PostList = {
  posts?: Post[];
  selectedPostId?: string;
  setSelectedPostId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const Post = ({ post, selectedPostId, setSelectedPostId }: PostProps) => {
  const [, deletePost] = useAction(api.post.delete);

  return (
    <Card
      className={`flex justify-between items-center ${selectedPostId === post.id ? "bg-accent" : ""}`}
      onClick={() => {
        if (selectedPostId === post.id) {
          setSelectedPostId(undefined);
        } else {
          setSelectedPostId(post.id);
        }
      }}
    >
      <div>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          Updated: {post.updatedAt.toDateString()}
        </CardDescription>
      </div>
      <div>
        <Button
          onClick={async (e) => {
            e.stopPropagation();
            await deletePost({ id: post.id });
            if (selectedPostId === post.id) {
              setSelectedPostId(undefined);
            }
          }}
          variant="destructive"
          size="sm"
        >
          <Trash />
        </Button>
      </div>
    </Card>
  );
};

export default ({ posts, selectedPostId, setSelectedPostId }: PostList) => {
  return (
    <section className="w-[400px] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="flex text-center">Posts</h2>
        <Button
          onClick={() => {
            setSelectedPostId(undefined);
          }}
          variant="secondary"
          size="sm"
        >
          New
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {posts?.map((post) => (
          <Post
            {...{ post, selectedPostId: selectedPostId, setSelectedPostId }}
          />
        ))}
      </div>
    </section>
  );
};
