# Product quiz

This application allows Shopify merchants to recommend products to customers based on their answers to a quiz. By using Gadget's platform, the app enables quiz creation, management, and integration with Shopify's storefront. Merchants can guide customers to relevant products using personalized recommendations from quiz results. This application has a theme app extension which displays the quiz on the Shopify online storefront.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-quiz-template.gadget.app)

## Key features

- Models

  - Quiz: Framework for creating and storing quizzes.
    - Fields
      - `slug`: The slug that will be used to determine which quiz to show the customer
      - `title`: The title of the product quiz
      - `results`: A hasMany relationship to the results of this quiz
      - `questions`: The questions on the quiz
  - Question: Individual questions included in a quiz.
    - Fields
      - `text`: The body of the question
      - `quiz`: The quiz that the question belongs to
      - `answers`: The answers associated to the question
  - Answer: Possible answers for a quiz question.
    - Fields
      - `text`: The body of the answer
      - `question`: The question that the answer belongs to
      - `recommendedProduct`: The product that is recommended for this answer
  - RecommendedProduct: A Shopify product recommended to shoppers based on their quiz answers.
    - Fields
      - `productSuggestion`: The suggested product
      - `answer`: The answer that the recommendation belongs to
  - QuizResult: Captures the shopper's email and the products recommended to them based on their quiz answers.
    - Fields
      - `email`: The email of the customer that filled out the form
      - `shopperSuggestion`: The product that was recommended to the customer
      - `quiz`: The quiz that the result record belongs to
  - ShopperSuggestion: Handles the has-many-through relationship between quizResult and shopifyProduct.
    - Fields
      - `product`: The product that the suggestion belongs to
      - `quizResult`: The quiz result record that the product belongs to
  - ShopifyTheme: Tracks whether a theme is using Shopify's Online Store 2.0.
    - Fields
      - `usingOnlineStore2`: Boolean field signifying if the store is using a Shopify 2.0 theme

- Frontend

  - `App.jsx`: Handles routing for the frontend pages.
  - `HomePage.jsx`: Main page for the Shopify admin app.
  - `CreateQuizPage.jsx`: Contains the form for creating new quizzes.
  - `EditQuizPage.jsx`: Contains the form for editing existing quizzes.
  - `QuizForm.jsx`: Entry point for the form used to create and edit quizzes.
  - `InstallTab.jsx`: Provides installation instructions for adding the quiz to the storefront.
  - `Store1Instructions.jsx`: Manual instructions for themes built on Online Store 1.0.

- Actions

  - `quiz/create`: Generates an ID/slug when a quiz is created (e.g., "My Cool Quiz" becomes "my-cool-quiz").
  - `quiz/delete`: Cascading delete that removes a quiz along with its questions, answers, and recommended products.
  - `shopifyAsset/create`: Detects whether the shop is using Shopify Storefront 1.0 or 2.0.
  - `shopifyAsset/update`: Updates to detect the shop’s storefront version.

- Access Controls

  - `unauthenticated`: Quizzes can be viewed by anyone who visits the shop, regardless of whether they are logged in.
  - `shopify-app-users`: Merchants can only read themes from their store.
