const selectedAnswers = [];
let currentQuestionIndex = 0;
let totalQuestions = 0;

/**
 * @param {*} evt - The submit event
 * @param {string} quizId - The id of the quiz that is being saved
 */
const onSubmitHandler = async (evt, quizId) => {
  evt.preventDefault();

  const email = document.getElementById("product-quiz__email").value;
  const submitButton = document.querySelector(".product-quiz__submit");
  const buttonText = submitButton.querySelector(".button-text");
  const buttonLoading = submitButton.querySelector(".button-loading");

  submitButton.classList.add("disabled", "loading");
  if (buttonText) buttonText.style.display = "none";
  if (buttonLoading) buttonLoading.style.display = "flex";

  const recommendedProducts = await window.api.answer.findMany({
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
  await window.api.quizResult.create({
    quiz: {
      _link: String(quizId),
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

const selectAnswer = (evt, answerId, answerText) => {
  selectedAnswers.push(answerId);
  let elId = evt.srcElement.id;
  let parent = document.getElementById(elId).parentNode;

  // Add selected class to the button
  const button = evt.srcElement;
  button.classList.add("selected");
  button.setAttribute("aria-checked", "true");

  // Update the parent container with a nice confirmation
  parent.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
  parent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 1.75rem; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 16px; color: white; font-weight: 600; box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3); animation: slideInUp 0.4s ease-out;" role="button" aria-pressed="true" tabindex="-1">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
      <span>${decodeURI(answerText)}</span>
    </div>
  `;

  // Mark question as answered
  const questionContainer = parent.closest(".product-quiz__question");
  questionContainer.classList.add("answered");

  // Disable all other buttons in the same question
  const allButtons = questionContainer.querySelectorAll(".answer");
  allButtons.forEach((btn) => {
    if (btn.id !== elId) {
      btn.classList.add("disabled");
      btn.setAttribute("aria-checked", "false");
      btn.setAttribute("tabindex", "-1");
    }
  });

  // Update progress
  currentQuestionIndex++;
  updateProgress();

  // Auto-scroll to next question after a short delay
  setTimeout(() => {
    const nextQuestion = questionContainer.nextElementSibling;
    if (nextQuestion) {
      nextQuestion.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // Focus on the first answer of the next question
      const nextFirstAnswer = nextQuestion.querySelector(
        ".answer:not(.disabled)"
      );
      if (nextFirstAnswer) {
        nextFirstAnswer.focus();
      }
    }
  }, 800);
};

const updateProgress = () => {
  const progressFill = document.querySelector(".quiz-progress-fill");
  const progressText = document.querySelector(".quiz-progress-text");

  if (progressFill && progressText) {
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestionIndex} of ${totalQuestions}`;
  }
};

// Event listener for document load
document.addEventListener("DOMContentLoaded", async function () {
  try {
    window.api = new Gadget({
      /**
       * App proxy configuration:
       * Subpath prefix: `apps`
       * Subpath: Change to your non-deterministic key
       * Endpoint format: `/<subpath_prefix>/<subpath>/api/graphql`
       */
      endpoint: "/apps/d9RjCiUHZo/api/graphql",
    });

    // Check if API is available
    if (!window.api) {
      throw new Error(
        "Gadget API not initialized. Check if the API script loaded correctly."
      );
    }

    // Check if quizSlug is set
    if (!window.quizSlug) {
      throw new Error("Quiz slug not found. Please check your theme settings.");
    }

    const quiz = await window.api.quiz.maybeFindBySlug(window.quizSlug, {
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

    // Check if quiz was found
    if (!quiz) {
      throw new Error(
        `No quiz found with slug: ${window.quizSlug}. Please check your quiz settings.`
      );
    }

    // Check if quiz has questions
    if (!quiz.questions || !quiz.questions.edges) {
      throw new Error(
        "Quiz found but has no questions. Please add questions to your quiz."
      );
    }

    const questions = quiz.questions.edges;
    totalQuestions = questions.length;

    if (!customElements.get("product-quiz")) {
      customElements.define(
        "product-quiz",
        class ProductQuiz extends HTMLElement {
          constructor() {
            super();
            this.form = this.querySelector("form");
            this.heading = this.querySelector(".product-quiz__title");
            this.heading.innerHTML = quiz.title;
            this.heading.id = "quiz-title";
            this.body = this.querySelector(".product-quiz__body p");
            this.body.innerHTML =
              quiz.description ||
              "Answer a few questions to get personalized product recommendations!";
            this.body.id = "quiz-description";
            this.questions = this.querySelector(".product-quiz__questions");

            // Add progress bar
            this.addProgressBar();

            const questionContainer = this.querySelector(
              ".product-quiz__question"
            );
            const answerContainer = this.querySelector(
              ".product-quiz__question-answer"
            );

            questions.forEach((question, i) => {
              const clonedDiv = questionContainer.cloneNode(true);
              clonedDiv.id = "question_" + i;
              clonedDiv.setAttribute("aria-labelledby", `question-title-${i}`);
              clonedDiv.insertAdjacentHTML(
                "beforeend",
                `<div><h3 id="question-title-${i}">${question.node.text}</h3></div><div class='product-quiz__answers product-quiz__answers_${i}' role="radiogroup" aria-labelledby="question-title-${i}"></div>`
              );
              this.questions.appendChild(clonedDiv);

              const answers = question.node.answers.edges;
              answers.forEach((answer, j) => {
                const clonedSpan = answerContainer.cloneNode(true);
                clonedSpan.id = "answer_" + i + "_" + j;
                clonedSpan.insertAdjacentHTML(
                  "beforeend",
                  `<button 
                    class="answer" 
                    id="${clonedSpan.id}" 
                    type="button"
                    role="radio"
                    aria-checked="false"
                    tabindex="0"
                    aria-describedby="question-title-${i}"
                  >${answer.node.text}</button>`
                );
                clonedSpan.addEventListener("click", (evt) => {
                  selectAnswer(evt, answer.node.id, answer.node.text);
                });
                clonedSpan.addEventListener("keydown", (evt) => {
                  if (evt.key === "Enter" || evt.key === " ") {
                    evt.preventDefault();
                    selectAnswer(evt, answer.node.id, answer.node.text);
                  }
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

          addProgressBar() {
            const progressHTML = `
              <div class="quiz-progress">
                <div class="quiz-progress-bar">
                  <div class="quiz-progress-fill" style="width: 0%"></div>
                </div>
                <div class="quiz-progress-text">Question 0 of ${totalQuestions}</div>
              </div>
            `;
            this.questions.insertAdjacentHTML("beforebegin", progressHTML);
          }
        }
      );
    }
  } catch (error) {
    console.error("Quiz initialization error:", error);

    // Display error message to user
    const quizContainer = document.querySelector("product-quiz");
    if (quizContainer) {
      quizContainer.innerHTML = `
        <div class="quiz-error" style="text-align: center; padding: 2rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626;">
          <h2 style="color: #dc2626; margin-bottom: 1rem;">⚠️ Quiz Error</h2>
          <p style="margin-bottom: 1rem;">${error.message}</p>
          <p style="font-size: 0.875rem; color: #6b7280;">
            Please check your quiz settings or contact support if the problem persists.
          </p>
        </div>
      `;
    }
  }
});
