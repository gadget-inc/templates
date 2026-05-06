# Frontend Forms

**📖 Full docs:** [docs.gadget.dev/guides/frontend/forms](https://docs.gadget.dev/guides/frontend/forms.md)

## AutoForm

The fastest way to build forms for models.

For rapid development:

```tsx
import { AutoForm, AutoInput, AutoSubmit } from "@gadgetinc/react/auto/polaris";

function QuickForm() {
  return (
    <AutoForm action={api.post.create}>
      <AutoInput field="title" />
      <AutoInput field="body" />
      <AutoSubmit />
    </AutoForm>
  );
}
```

## useActionForm

The primary way to build forms not tied to models in Gadget apps.

```tsx
import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";

function CreatePost() {
  const {
    submit,
    register,
    formState: { isSubmitting, errors }
  } = useActionForm(api.post.create);

  return (
    <form onSubmit={submit}>
      <input {...register("title")} placeholder="Title" />
      {errors?.title && <span>{errors.title.message}</span>}

      <textarea {...register("body")} placeholder="Body" />
      {errors?.body && <span>{errors.body.message}</span>}

      <button disabled={isSubmitting}>Create Post</button>
    </form>
  );
}
```

## Editing Existing Records

```tsx
function EditPost({ id }) {
  const {
    submit,
    register,
    formState: { isSubmitting, errors }
  } = useActionForm(api.post.update, {
    findBy: id  // Loads existing record
  });

  return (
    <form onSubmit={submit}>
      <input {...register("title")} />
      <button disabled={isSubmitting}>Save</button>
    </form>
  );
}
```

## Validation

Validations are defined in the model schema and automatically enforced:

```tsx
// Validation errors appear in formState.errors
{errors?.email && <span>{errors.email.message}</span>}
```

## File Uploads

```tsx
function UploadAvatar() {
  const { submit, register, formState } = useActionForm(api.user.update);

  return (
    <form onSubmit={submit}>
      <input type="file" {...register("avatar")} />
      <button disabled={formState.isSubmitting}>Upload</button>
    </form>
  );
}
```

## Best Practices

- ✅ Use `AutoForm` when possible
- ✅ Use `useActionForm` for all forms
- ✅ Handle validation errors
- ✅ Disable submit during loading
