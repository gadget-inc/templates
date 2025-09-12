/**
 *
 * @param {*} evt - The submit event
 * @param {string} quizId - The id of the quiz that is being saved
 */
const onSubmitHandler = async (evt, quizId) => {
  evt.preventDefault();

  const email = document.getElementById("product-quiz__email").value;
  const submitButton = document.querySelector(".product-quiz__submit");

  submitButton.classList.add("disabled", "loading");
  submitButton.textContent = "Getting your results...";

  const recommendedProducts = await api.answer.findMany({
    filter: {
      OR: selectedAnswers.map((answerId) => ({
        id: {
          equals: answerId,
        },
      })),
    },
    select: {
      recommendedProduct: {
        id: true,
        productSuggestion: {
          id: true,
          title: true,
          body: true,
          handle: true,
          media: {
            edges: {
              node: {
                image: true,
              },
            },
          },
        },
      },
    },
  });

  // save email and recommendations to Gadget for follow-up emails
  await api.quizResult.create({
    quiz: {
      _link: quizId,
    },
    email,
    shopperSuggestions: recommendedProducts.map((recommendedProductId) => ({
      create: {
        product: {
          _link: recommendedProductId,
        },
      },
    })),
  });
  // await saveSelections(quizId, email, recommendedProducts);

  // display recommendations with beautiful styling
  let recommendedProductHTML = `
    <div class="quiz-results">
      <h2>🎉 Perfect! Here are your personalized recommendations</h2>
      <div class="product-recommendations">
  `;

  recommendedProducts.forEach((result) => {
    const { recommendedProduct } = result;
    const imgUrl =
      recommendedProduct.productSuggestion?.media?.edges?.[0]?.node?.image
        .originalSrc;
    const productLink = recommendedProduct.productSuggestion.handle;
    const productTitle = recommendedProduct.productSuggestion.title;
    const productPrice =
      recommendedProduct.productSuggestion.priceRange?.minVariantPrice
        ?.amount || "Price available on product page";

    recommendedProductHTML += `
      <div class="product-card">
        <h3>${productTitle}</h3>
        ${imgUrl ? `<img src="${imgUrl}" alt="${productTitle}" loading="lazy">` : ""}
        <p style="margin: 1rem 0; font-weight: 600; color: #667eea; font-size: 1.125rem;">$${productPrice}</p>
        <a class="button" href="/products/${productLink}">View Product</a>
      </div>
    `;
  });

  recommendedProductHTML += `
      </div>
      <div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: #ffffff; border-radius: 16px; border: 2px solid #e2e8f0;">
        <p style="margin: 0; font-size: 1.125rem; color: #4a5568; line-height: 1.6;">Thank you for taking our quiz! We'll send you more personalized recommendations via email.</p>
      </div>
    </div>
  `;

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

  // Add selected class to the button
  const button = evt.srcElement;
  button.classList.add("selected");

  // Update the parent container with a nice confirmation
  parent.style.transition = "all 0.3s ease";
  parent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 12px; color: white; font-weight: 600;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
      <span>${decodeURI(answerText)}</span>
    </div>
  `;

  // Disable all other buttons in the same question
  const questionContainer = parent.closest(".product-quiz__question");
  const allButtons = questionContainer.querySelectorAll(".answer");
  allButtons.forEach((btn) => {
    if (btn.id !== elId) {
      btn.style.opacity = "0.5";
      btn.style.pointerEvents = "none";
    }
  });
};

// Event listener for document load
document.addEventListener("DOMContentLoaded", async function () {
  const quiz = await api.quiz.findFirst({
    filter: {
      slug: {
        equals: window.quizSlug,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
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
              `<div><h3>${question.node.text}</h3></div><div class='product-quiz__answers product-quiz__answers_${i}'></div>`
            );
            this.questions.appendChild(clonedDiv);

            const answers = question.node.answers.edges;
            answers.forEach((answer, j) => {
              const clonedSpan = answerContainer.cloneNode(true);
              clonedSpan.id = "answer_" + i + "_" + j;
              clonedSpan.insertAdjacentHTML(
                "beforeend",
                `<button class="answer" id="${clonedSpan.id}">${answer.node.text}</button>`
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
