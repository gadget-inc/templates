import { api } from "../../api";
import {
  AutoBooleanInput,
  AutoForm,
  AutoHiddenInput,
  AutoInput,
  AutoSubmit,
  SubmitResultBanner,
} from "../auto";

type PostFormProps = {
  selectedPostId?: string;
  userId: string;
};

export default ({ selectedPostId, userId }: PostFormProps) => {
  return (
    <section className="flex flex-col flex-1 gap-4">
      <AutoForm
        action={selectedPostId ? api.post.update : api.post.create}
        findBy={selectedPostId ?? ""}
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
    </section>
  );
};
