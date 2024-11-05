import { Client, GadgetRecordList } from "@gadget-client/product-quiz-template";

declare global {
  interface Window {
    api: Client;
    shopId: string;
    quizSlug: string;
  }
}

const api: Client = window.api;

// query Gadget for the recommended products based on quiz answers, using a JS query
const fetchRecommendedProducts = async (answerIds: string[]) => {
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
const fetchQuiz = async (quizSlug: string) => {
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
const saveSelections = async (
  quizId: string,
  email: string,
  recommendedProducts: GadgetRecordList<{
    recommendedProduct: {
      id: string;
      productSuggestion: {
        id: string;
        title: string | null;
        body: string | null;
        handle: string | null;
        images: {
          edges: {
            node: {
              source: string | null;
            };
          }[];
        };
      } | null;
    } | null;
  }>
) => {
  const productsQuery = recommendedProducts.map((rp) => {
    return {
      create: {
        product: {
          _link: rp.recommendedProduct?.productSuggestion?.id ?? "",
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

const onSubmitHandler = async (evt: Event, quizId: string) => {
  evt.preventDefault();

  const emailInput = document.getElementById("product-quiz__email");

  if (!emailInput) {
    throw new Error("Email input element not found");
  }
  const email: string = (emailInput as HTMLInputElement).value;

  const submitButton = document.querySelector(".product-quiz__submit");
  if (submitButton) {
    submitButton.classList.add("disabled");
  }

  const recommendedProducts = await fetchRecommendedProducts(selectedAnswers);

  // save email and recommendations to Gadget for follow-up emails
  await saveSelections(quizId, email, recommendedProducts);

  // display recommendations
  let recommendedProductHTML =
    "<div><h2>Based on your selections, we recommend the following products</h2><div style='display: flex; overflow: auto'>";

  recommendedProducts.forEach((result) => {
    const { recommendedProduct } = result;
    const imgUrl =
      recommendedProduct?.productSuggestion?.images?.edges?.[0]?.node?.source;
    const productLink = recommendedProduct?.productSuggestion?.handle;
    recommendedProductHTML +=
      `<span style="padding: 8px 16px; margin-left: 10px; border: black 1px solid; align-items: center; display: flex; flex-direction: column"><h3>${recommendedProduct?.productSuggestion?.title}</h3><a class="button" href="/products/${productLink}">Check it out</a>` +
      `<br/><img src=${imgUrl} width="200px" /><br /></span>`;
  });

  recommendedProductHTML += "</div></div>";
  const questionsElement = document.getElementById("questions");
  if (questionsElement) {
    questionsElement.innerHTML = recommendedProductHTML;
  }

  if (submitButton) {
    submitButton.classList.add("hidden");
  }
  const submitHrElement = document.querySelector(".product-quiz__submit-hr");
  if (submitHrElement) {
    submitHrElement.classList.add("hidden");
  }
  const emailContainer = document.querySelector(
    ".product-quiz__email-container"
  );
  if (emailContainer) {
    emailContainer.classList.add("hidden");
  }
};

let selectedAnswers: string[] = [];
const selectAnswer = (evt: Event, answerId: string, answerText: string) => {
  selectedAnswers.push(answerId);
  const srcElement = evt.srcElement as HTMLElement | null;
  if (!srcElement) {
    throw new Error("Source element not found");
  }
  let elId = srcElement.id;
  const element = document.getElementById(elId);
  if (!element || !element.parentNode) {
    throw new Error("Parent element not found");
  }
  let parent = element.parentNode as HTMLElement;
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
          form: HTMLFormElement | null;
          heading: HTMLElement | null;
          body: HTMLElement | null;
          questions: HTMLElement | null;

          constructor() {
            super();
            this.form = this.querySelector("form");
            this.heading = this.querySelector(".product-quiz__title");
            if (this.heading) {
              this.heading.innerHTML = quiz.title;
            }
            this.body = this.querySelector(".product-quiz__body span");
            if (this.body && quiz.body) {
              this.body.innerHTML = quiz.body;
            }
            this.questions = this.querySelector(".product-quiz__questions");

            const questionContainer = this.querySelector(
              ".product-quiz__question"
            );
            const answerContainer = this.querySelector(
              ".product-quiz__question-answer"
            );

            if (!questionContainer) {
              throw new Error("Question container element not found");
            }

            questions.forEach((question, i) => {
              const clonedDiv = questionContainer.cloneNode(
                true
              ) as HTMLElement;
              clonedDiv.id = "question_" + i;
              clonedDiv.insertAdjacentHTML(
                "beforeend",
                "<hr /><div><h3>" +
                  question.node.text +
                  `</h3></div><div class='product-quiz__answers_${i}'></div>`
              );
              if (this.questions) {
                this.questions.appendChild(clonedDiv);
              } else {
                throw new Error("Questions container element not found");
              }

              const answers = question.node.answers.edges;
              if (!answerContainer) {
                throw new Error("Answer container element not found");
              }

              answers.forEach((answer, j) => {
                const clonedSpan = answerContainer.cloneNode(
                  true
                ) as HTMLElement;
                clonedSpan.id = "answer_" + i + "_" + j;
                clonedSpan.insertAdjacentHTML(
                  "beforeend",
                  `<span><button class="button answer" id="${clonedSpan.id}">${answer.node.text}</button></span>`
                );
                clonedSpan.addEventListener("click", (evt) => {
                  selectAnswer(evt, answer.node.id, answer.node.text);
                });
                const answersContainer = this.querySelector(
                  `.product-quiz__answers_${i}`
                );
                if (answersContainer) {
                  answersContainer.appendChild(clonedSpan);
                } else {
                  throw new Error(
                    `Answers container element not found for question ${i}`
                  );
                }
              });
            });

            this.form?.addEventListener("submit", async function (evt) {
              await onSubmitHandler(evt, quiz.id);
            });
          }
        }
      );
    }
  });
});
