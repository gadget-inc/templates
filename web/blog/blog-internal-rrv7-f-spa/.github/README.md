# CRUD blog with authentication

This template demonstrates how to implement basic CRUD operations for a blog using Gadget, with both public and protected routes for authenticated and unauthenticated users.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=blog-internal-rrv7-f-spa.gadget.app)

## Key Features

- Frontends

  - `_user.signed-in`: Admin view of blog posts for authenticated users.
  - `_anon._index`: Public view of blog posts for unauthenticated users.

- Models

  - `post`: Stores blog post data and associates it with the user who created it.
    - Fields
      - `isPublished`: Boolean value representing the published state of the post
      - `content`: The body of the post
      - `user`: The user that the post belongs to
  - `user`: Tracks user authentication and email verification.
    - Fields
      - `posts`: The posts the the user owns

- Actions

  - `post/create`: Creates a blog post linked to the user who created it.
  - `post/update`: Updates an existing post.
  - `post/delete`: Deletes a post from the database.

- Access Controls
  - `unauthenticated` for `post`: Unauthenticated users can view posts where `isPublished` is `true`.
  - `signed-in` for `post`: Signed-in users can view, create, update, and delete their own posts.
