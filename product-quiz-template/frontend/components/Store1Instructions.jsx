import {
  Text,
  BlockStack,
  Divider
} from "@shopify/polaris";

import rawQuizPageLiquid from "../assets/quiz-page.liquid?raw";
import rawProductQuizJs from "../assets/product-quiz.js?raw";
import { CodeBlock } from "./CodeBlock";

export function Store1Instructions({ quizId }) {

  const pageQuizJson = `{
  "sections": {
    "main": {
      "type": "quiz-page",
      "settings": {}
    }
  },
  "order": ["main"]
}`;


  return (
    <BlockStack gap="500">
      <BlockStack gap="300">
        <Text>Under Sections, create a new section called quiz-page.liquid. We're going to replace this page with the following code:</Text>
        <CodeBlock>{rawQuizPageLiquid.replaceAll("{{QUIZID}}", quizId)}</CodeBlock>
      </BlockStack>

      <Divider />

      <BlockStack gap="300">
        <Text>Now under Templates, select “Add a new template” and add a template called page.quiz.json. This requires you to select the page template type.</Text>

        <Text>Replace the generated file with the following JSON:</Text>
        <CodeBlock>{pageQuizJson}</CodeBlock>
      </BlockStack>

      <Divider />

      <BlockStack gap="300">
        <Text>Under the Assets section in the sidebar, select Add a new asset and create a new JavaScript file called product-quiz.js. You can then add the following to that file:</Text>
        <CodeBlock>{rawProductQuizJs}</CodeBlock>
      </BlockStack>
    </BlockStack>
  );
}