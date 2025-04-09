// Query Gadget for the recommended products based on quiz answers
const fetchRecommendedProducts = async (answerIds) => {
  const reply = await fetch(
    `${window.shopURL}/apps/pq-p-r-ssr/recommendations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answerIdFilters: answerIds.map((answerId) => ({
          id: {
            equals: answerId,
          },
        })),
      }),
    }
  );

  return await reply.json();
};

// Fetch the quiz questions and answers to be presented to shoppers
const fetchQuiz = async (quizSlug) => {
  const reply = await fetch(
    `${window.shopURL}/apps/pq-p-r-ssr/quiz?slug=${quizSlug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await reply.json();
};

// Save the shopper's email and recommended product to Gadget (for follow-up emails!)
const saveSelections = async (quizId, email, recommendedProducts) => {
  const recommendationIds = recommendedProducts.map(
    (rp) => rp.recommendedProduct.productSuggestion.id
  );

  await fetch(`${window.shopURL}/apps/pq-p-r-ssr/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quizId,
      email,
      recommendedProducts: recommendationIds,
    }),
  });
};

const onSubmitHandler = async (evt, quizId) => {
  evt.preventDefault();

  const email = document.getElementById("product-quiz__email").value;

  const submitButton = document.querySelector(".product-quiz__submit");
  submitButton.classList.add("disabled");

  const recommendedProducts = await fetchRecommendedProducts(selectedAnswers);

  // save email and recommendations to Gadget for follow-up emails
  await saveSelections(quizId, email, recommendedProducts);

  // display recommendations
  let recommendedProductHTML =
    "<div><h2>Based on your selections, we recommend the following products</h2><div style='display: flex; overflow: auto'>";

  recommendedProducts.forEach((result) => {
    const { recommendedProduct } = result;
    const imgUrl =
      recommendedProduct.productSuggestion?.media?.edges?.[0]?.node?.image
        .originalSrc;
    const productLink = recommendedProduct.productSuggestion.handle;
    recommendedProductHTML +=
      `<span style="padding: 8px 16px; margin-left: 10px; border: black 1px solid; align-items: center; display: flex; flex-direction: column"><h3>${recommendedProduct.productSuggestion.title}</h3><a class="button" href="/products/${productLink}">Check it out</a>` +
      `<br/><img src=${imgUrl} width="200px" /><br /></span>`;
  });

  recommendedProductHTML += "</div></div>";
  document.getElementById("questions").innerHTML = recommendedProductHTML;

  submitButton.classList.add("hidden");
  document.querySelector(".product-quiz__submit-hr").classList.add("hidden");
  document
    .querySelector(".product-quiz__email-container")
    .classList.add("hidden");
};

let selectedAnswers = [];
const selectAnswer = (evt, answerId, answerText) => {
  selectedAnswers.push(answerId);
  let elId = evt.srcElement.id;
  let parent = document.getElementById(elId).parentNode;
  parent.innerHTML = "<h3><b>" + decodeURI(answerText) + "</b> selected</h3>";
};

document.addEventListener("DOMContentLoaded", function () {
  const quizSlug = window.quizSlug;

  fetchQuiz(quizSlug).then(async (quiz) => {
    console.log("Quiz data", quiz);

    const questions = quiz.questions.edges;

    if (!customElements.get("product-quiz")) {
      customElements.define(
        "product-quiz",
        class ProductQuiz extends HTMLElement {
          constructor() {
            super();
            this.form = this.querySelector("form");
            this.heading = this.querySelector(".product-quiz__title");
            this.heading.innerHTML = quiz.title;
            this.body = this.querySelector(".product-quiz__body span");
            this.body.innerHTML = quiz.body;
            this.questions = this.querySelector(".product-quiz__questions");

            const questionContainer = this.querySelector(
              ".product-quiz__question"
            );
            const answerContainer = this.querySelector(
              ".product-quiz__question-answer"
            );

            questions.forEach((question, i) => {
              const clonedDiv = questionContainer.cloneNode(true);
              clonedDiv.id = "question_" + i;
              clonedDiv.insertAdjacentHTML(
                "beforeend",
                "<hr /><div><h3>" +
                  question.node.text +
                  `</h3></div><div class='product-quiz__answers_${i}'></div>`
              );
              this.questions.appendChild(clonedDiv);

              const answers = question.node.answers.edges;
              answers.forEach((answer, j) => {
                const clonedSpan = answerContainer.cloneNode(true);
                clonedSpan.id = "answer_" + i + "_" + j;
                clonedSpan.insertAdjacentHTML(
                  "beforeend",
                  `<span><button class="button answer" id="${clonedSpan.id}">${answer.node.text}</button></span>`
                );
                clonedSpan.addEventListener("click", (evt) => {
                  selectAnswer(evt, answer.node.id, answer.node.text);
                });
                this.querySelector(`.product-quiz__answers_${i}`).appendChild(
                  clonedSpan
                );
              });
            });

            this.form.addEventListener("submit", async function (evt) {
              await onSubmitHandler(evt, quiz.id);
            });
          }
        }
      );
    }
  });
});
