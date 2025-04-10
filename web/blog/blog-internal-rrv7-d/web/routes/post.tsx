import { useParams } from "react-router";
import { api } from "../api";
import {
  AutoBooleanInput,
  AutoForm,
  AutoHiddenInput,
  AutoInput,
  AutoSubmit,
  SubmitResultBanner,
} from "@/components/auto";
import { useUser } from "@gadgetinc/react";

export default function () {
  const { id } = useParams();
  const { id: userId } = useUser();

  return (
    <AutoForm
      action={id ? api.post.update : api.post.create}
      findBy={id ?? ""}
      select={
        id
          ? {
              id: true,
              title: true,
              isPublished: true,
              content: { markdown: true, truncatedHTML: true },
            }
          : undefined
      }
    >
      <AutoHiddenInput field="user" value={userId} />
      <SubmitResultBanner />
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <AutoInput field="title" label="Title" />
        </div>
        <AutoBooleanInput field="isPublished" label="Published" />
      </div>
      <AutoInput field="content" label="Body" />
      <AutoSubmit />
    </AutoForm>
  );
}
