// initialize an API client object
const api = new Gadget();

// query Gadget for the recommended products based on quiz answers, using a JS query
const fetchRecommendedProducts = async (answerIds) => {
  const queryIdFilter = answerIds.map((answerId) => {
    return { id: { equals: answerId } };
  });

  const recommendedProducts = await api.answer.findMany({
    filter: {
      OR: queryIdFilter,
    },
    select: {
      recommendedProduct: {
        id: true,
        productSuggestion: {
          id: true,
          title: true,
          body: true,
          handle: true,
          images: {
            edges: {
              node: {
                source: true,
              },
            },
          },
        },
      },
    },
  });

  return recommendedProducts;
};

// fetch the quiz questions and answers to be presented to shoppers, using a GraphQL query
const fetchQuiz = async (quizSlug) => {
  const quiz = await api.quiz.findFirst({
    filter: {
      slug: { equals: quizSlug },
    },
    select: {
      id: true,
      title: true,
      body: true,
      questions: {
        edges: {
          node: {
            id: true,
            text: true,
            answers: {
              edges: {
                node: {
                  id: true,
                  text: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return quiz;
};

// save the shopper's email and recommended productions to Gadget (for follow-up emails!)
const saveSelections = async (quizId, email, recommendedProducts) => {
  const productsQuery = recommendedProducts.map((rp) => {
    return {
      create: {
        product: {
          _link: rp.recommendedProduct.productSuggestion.id,
        },
        shop: {
          _link: window.shopId,
        },
      },
    };
  });
  await api.quizResult.create({
    quiz: {
      _link: quizId,
    },
    shop: {
      _link: window.shopId,
    },
    email: email,
    shopperSuggestions: [...productsQuery],
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
      recommendedProduct.productSuggestion.images?.edges?.[0]?.node?.source;
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
  var quizSlug = window.quizSlug;

  fetchQuiz(quizSlug).then(async (quiz) => {
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
