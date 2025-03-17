import { useFindMany } from "@gadgetinc/react";
import { api } from "@/api";
import PostList from "@/components/post/PostList";
import PostForm from "@/components/post/PostForm";
import { useState } from "react";

export default function () {
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>(
    undefined
  );

  const [{ data: posts, error, fetching }] = useFindMany(api.post, {
    select: {
      id: true,
      title: true,
      isPublished: true,
      updatedAt: true,
    },
  });

  if (!posts && fetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-6 flex gap-6">
      <PostList {...{ posts, selectedPostId, setSelectedPostId }} />
      <PostForm {...{ selectedPostId }} />
    </div>
  );
}
