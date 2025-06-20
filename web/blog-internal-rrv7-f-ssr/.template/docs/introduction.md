# Blog template

Core Purpose: This application serves as a private, internal blogging platform for teams. It allows authenticated users to create, share, and manage content in a secure, multi-user environment where posts are only posted and managed by members of the organization.

Key Functionality: The platform is built around user and post models.

- User authentication: Users can sign up and sign in with email/password or Google, managed by the user model and its associated actions (signUp, signIn, etc.).
- Post management: Authenticated users can create, update, and delete posts, which include a title, rich text content, and a publish status. All post operations are handled by the post model's create, update, and delete actions.
- Team features: The app includes an invitation system using the invite model to add new members. Users can also view a team page and manage their own profiles.
