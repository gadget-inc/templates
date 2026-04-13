# Frontend Hooks

**📖 Full docs:**
- [Building frontends](https://docs.gadget.dev/guides/frontend/building-frontends.md)
- [@gadgetinc/react reference](https://docs.gadget.dev/reference/react.md)

## Overview

`@gadgetinc/react` provides React hooks for querying and mutating Gadget data.

## Key Hooks

### useUser - Current User

The simplest way to get the current authenticated user:

```tsx
import { useUser } from "@gadgetinc/react";

function Profile() {
  const user = useUser();

  // Three possible states:
  if (user === undefined) return <div>Loading...</div>;  // Still loading
  if (!user) return <div>Not logged in</div>;             // Not authenticated
  return <div>Hello, {user.email}</div>;                  // Authenticated
}
```

**⚠️ Important:** `useUser()` returns **three** distinct states — `undefined` (loading), `null` (not authenticated), and a user object (authenticated). Always handle the `undefined` case to avoid flashing unauthenticated UI while the session loads.

### useFindMany - Query Multiple Records

```tsx
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";

function PostList() {
  const [{ data, fetching, error }] = useFindMany(api.post, {
    filter: { published: { equals: true } },
    sort: { createdAt: "Descending" },
    first: 20
  });

  if (fetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### useFindOne - Query Single Record

```tsx
function PostDetail({ id }) {
  const [{ data: post, fetching }] = useFindOne(api.post, id, {
    select: { id: true, title: true, body: true, author: { name: true } }
  });

  if (fetching) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>By {post.author.name}</p>
      <div>{post.body}</div>
    </div>
  );
}
```

### useAction - Run Actions

```tsx
function CreatePost() {
  const [{ data, fetching, error }, create] = useAction(api.post.create);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create({ title: "My Post", body: "Content..." });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={fetching}>Create Post</button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

#### File Uploads with useAction

Gadget file fields accept a `{ file: File }` object directly in action params:

```tsx
function CreatePostWithImage() {
  const [{ fetching }, create] = useAction(api.post.create);

  const handleSubmit = async (imageFile: File) => {
    await create({
      title: "My Post",
      coverImage: { file: imageFile },  // Pass File object directly
    });
  };
}
```

Display uploaded files with: `post.coverImage?.url`

### Conditional Queries with pause

Use `pause` to prevent a query from running until a condition is met:

```tsx
function UserPosts({ userId }: { userId: string | undefined }) {
  const [{ data }] = useFindMany(api.post, {
    filter: { authorId: { equals: userId! } },
    pause: !userId,  // Don't run query until userId is available
  });

  return <div>{data?.map(post => <div key={post.id}>{post.title}</div>)}</div>;
}
```

**⚠️ Important:** Always use `pause` when a required filter value might be `undefined` or `null`. Without `pause`, the query runs immediately with an invalid filter, which can cause errors or return unexpected results.

### useActionForm - Forms with Validation

```tsx
function EditPost({ id }) {
  const {
    submit,
    register,
    formState: { isSubmitting, errors }
  } = useActionForm(api.post.update, { findBy: id });

  return (
    <form onSubmit={submit}>
      <input {...register("title")} />
      {errors?.title && <span>{errors.title.message}</span>}

      <button disabled={isSubmitting}>Save</button>
    </form>
  );
}
```

## Live Queries

Real-time updates:

```tsx
const [{ data }] = useFindMany(api.post, {
  live: true  // Re-fetches when data changes
});
```

## Pagination

```tsx
function PaginatedPosts() {
  const [{ data, fetching }, refresh] = useFindMany(api.post, {
    first: 10
  });

  const loadMore = () => {
    refresh({ first: 10, after: data[data.length - 1].id });
  };

  return (
    <>
      {data?.map(post => <div key={post.id}>{post.title}</div>)}
      <button onClick={loadMore}>Load More</button>
    </>
  );
}
```

## Best Practices

- ✅ Use `live: true` for real-time data
- ✅ Select only fields you need
- ✅ Handle loading and error states
- ✅ Use `useActionForm` for forms
- ❌ Don't fetch in loops
- ❌ Don't over-select fields

**📖 More info:**
- [Frontend forms](https://docs.gadget.dev/guides/frontend/forms.md)
- [Real-time queries](https://docs.gadget.dev/guides/frontend/realtime-queries.md)
- [@gadgetinc/react hooks reference](https://docs.gadget.dev/reference/react.md)
