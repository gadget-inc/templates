# Product quiz template

This is a sample project for an implementation of a product quiz app that is embedded into a Shopify storefront.

## Table of contents

- [Getting started](#getting-started)
- [App overview](#app-overview)
  - [Starter template](#starter-template)
  - [Connections](#connections)
  - [Data modeling + template overview](#data-modeling-template-overview)
    - [Template default models](#template-default-models)
  - [Environment variables](#environment-variables)
  - [Backend (actions + code)](#backend-actions-code)
  - [Access roles + API permissions](#access-roles-api-permissions)
  - [Frontend](#frontend)
- [Extending this template](#extending-this-template)
- [Questions?](#questions)

## Getting started

It is best to go through the Gadget guide on [setting up the product quiz](https://docs.gadget.dev/guides/tutorials/product-recommendation-quiz-app). It contains all the instructions needed to get this app up and running, including installing on a Shopify store and embedding the quiz into a Shopify storefront.

Some basic instructions are as follows:

- Go to the Shopify Connections page in Gadget: Connections -> Shopify -> add a Development app
- Set up a Shopify connection by creating a new Shopify Partners app
  - Copy the Client Key and Secret from the Partners dashboard into Gadget
  - Copy the URL and Redirection URL over to the Partners dashboard
- Install the Shopify app on a development store
- [Build a quiz](https://docs.gadget.dev/guides/tutorials/product-recommendation-quiz-app#making-our-first-quiz) in the admin
- [Embed your quiz in a Shopify storefront](https://docs.gadget.dev/guides/tutorials/product-recommendation-quiz-app#installing-in-a-shopify-theme)

## App overview

### Starter template

This app is built using the **Shopify app** starter template.

### Connections

This app uses Gadget's built-in **Shopify** connection. Instructions for setting up can be found in the **Getting started** section above.

### Data modeling + template overview

An ERD and explanation of the data models used in this app can be found in the [Quiz data models](https://docs.gadget.dev/guides/tutorials/product-recommendation-quiz-app#quiz-data-models) section of the written tutorial.

### Environment variables

No additional environment variables are used for this app.

### Backend (actions + code)

Custom code has been added to handle the deletion of quizzes. When a `quiz` is deleted, so are all that quiz's `questions`, `answers`, and `recommendedProducts`. This code can be found in the following files:

- `quiz/actions/delete.js`: deletes all quiz `questions`
- `question/actions/delete.js`: deletes all question `answers`
- `answer/actions/delete.js`: deletes the `recommendedProduct` associated with an answer

### Access roles + API permissions

Storefront shoppers (`unauthenticated` role) need to be able to call some parts of your app's API in order to read the loaded quiz, and save their responses.

- `unauthenticated` users
  - `quiz`: `read` permission has been granted
  - `question`: `read` permission has been granted
  - `answer`: `read` permission has been granted
  - `recommendedProduct`: `read` permission has been granted
  - `quizResult`: `create` premisson has been granted
  - `shopperSuggestion`: `create` permission has been granted

Shopify admin users (`shopify-app-users` role) need to be able to read, create, edit, and delete quizzes.

- `shopify-app-users`
  - `quiz`: full access to all CRUD operations
  - `question`: full access to all CRUD operations
  - `answer`: full access to all CRUD operations
  - `recommendedProduct`: full access to all CRUD operations

### Frontend

This frontend is an embedded admin app that allows merchants to create new quizzes that can then be embedded on the storefront.

- `frontend/App.jsx`: the root of your app's frontend
- `frontend/pages`: contains the pages that make up your app's frontend
  - `frontend/pages/HomePage.jsx`: displays a list of all created quizzes
  - `frontend/pages/CreateQuizPage.jsx`: allows merchants to create a new quiz
  - `frontend/pages/EditQuizPage.jsx`: allows merchants to edit an existing quiz
- `frontend/components`: contains the components that make up your app's frontend
  - `frontend/components/QuizForm.jsx`: the root of the quiz creation/editing form, shared between the CreateQuizPage and EditQuizPage
  - `frontend/components/Answer.jsx`: renders a single answer in the quiz creation/editing form
  - `frontend/components/PageTemplate.jsx`: a simple page template used to hold the page title bar so it is consistent across the app
- `frontend/utils`: contains helpful util files used to handle quiz data
  - `frontend/utils/initialState.jsx`: contains the initial state objects for a new quiz question and answer
  - `frontend/utils/saveToGadgetFormatting`: converts the quiz data into the format needed to save to Gadget

## Extending this template

You can use this app as a starting point for your own app, or you can build your own app from scratch.
Make sure to add a Shopify Client Id and Secret to the production environment on the Shopify connection page before deploying your app to production! Also make sure to use the production version of your direct script tag to embed your quiz in a Shopify storefront after deploying to production.

## Questions?

Join our [developer Discord](https://ggt.link/discord) if you have any questions about this template or Gadget!