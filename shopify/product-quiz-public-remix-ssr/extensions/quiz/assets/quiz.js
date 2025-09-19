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
  const submitButton = document.querySelector("button[name='quiz-submit']");
  const buttonText = submitButton.querySelector("span:first-child");
  const buttonLoading = submitButton.querySelector("span:last-child");

  submitButton.disabled = true;
  if (buttonText) buttonText.style.display = "none";
  if (buttonLoading) buttonLoading.style.display = "inline";

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

  console.log(quizId);

  console.log(recommendedProducts);

  // save email and recommendations to Gadget for follow-up emails
  await window.api.quizResult.create({
    quiz: {
      _link: quizId,
    },
    email,
    shopperSuggestions: recommendedProducts.map(({ recommendedProduct }) => ({
      create: {
        product: {
          _link: recommendedProduct.id,
        },
      },
    })),
  });

  // display recommendations with enhanced styling
  let recommendedProductHTML = `
    <div>
      <h2>🎉 Perfect! Here are your personalized recommendations</h2>
      <div>
  `;

  recommendedProducts.forEach((result, index) => {
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
      <div style="animation-delay: ${index * 0.2}s;">
        <h3>${productTitle}</h3>
        ${imgUrl ? `<img src="${imgUrl}" alt="${productTitle}" loading="lazy">` : ""}
        <p>$${productPrice}</p>
        <a href="/products/${productLink}">View Product</a>
      </div>
    `;
  });

  recommendedProductHTML += `
      </div>
      <div>
        <p>Thank you for taking our quiz! We'll send you more personalized recommendations via email.</p>
      </div>
    </div>
  `;

  document.getElementById("questions").innerHTML = recommendedProductHTML;

  submitButton.style.display = "none";
  document.querySelector("hr").style.display = "none";
  document.querySelector("div:has(#product-quiz__email)").style.display =
    "none";
};

const selectAnswer = (evt, answerId, answerText) => {
  selectedAnswers.push(answerId);
  const button = evt.target;
  const questionContainer = button.closest("[data-question]");
  const answersContainer = button.closest("[data-answers]");

  // Mark as selected
  button.setAttribute("aria-checked", "true");
  button.setAttribute("data-selected", "true");

  // Add selection animation to the button
  button.style.transform = "scale(0.95)";
  button.style.transition = "transform 0.1s ease-out";

  setTimeout(() => {
    button.style.transform = "scale(1)";

    // Replace the answers container with confirmation
    answersContainer.innerHTML = `
      <div role="status" aria-live="polite">
        ${decodeURI(answerText)}
      </div>
    `;

    // Mark question as answered
    questionContainer.setAttribute("data-answered", "true");

    // Update progress with animation
    currentQuestionIndex++;
    updateProgress();

    // Show next question with staggered animation
    const nextQuestion = questionContainer.nextElementSibling;
    if (nextQuestion) {
      // Add a subtle entrance animation to the next question
      nextQuestion.style.animationDelay = "0.3s";
      nextQuestion.style.opacity = "1";

      // Auto-scroll to next question after a delay
      setTimeout(() => {
        nextQuestion.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Focus on the first answer of the next question
        const nextFirstAnswer = nextQuestion.querySelector(
          "button:not([data-selected])"
        );
        if (nextFirstAnswer) {
          nextFirstAnswer.focus();
        }
      }, 600);
    }
  }, 150);
};

const updateProgress = () => {
  const progressText = document.querySelector("[data-progress-text]");

  if (progressText) {
    // Add a subtle animation to the progress update
    progressText.style.transform = "scale(1.05)";
    progressText.style.transition = "transform 0.2s ease-out";

    setTimeout(() => {
      progressText.textContent = `Question ${currentQuestionIndex} of ${totalQuestions}`;
      progressText.style.transform = "scale(1)";
    }, 100);
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
            this.heading = this.querySelector("#quiz-title");
            this.heading.innerHTML = quiz.title;
            this.body = this.querySelector("#quiz-description");
            this.body.innerHTML =
              quiz.description ||
              "Answer a few questions to get personalized product recommendations!";
            this.questions = this.querySelector("#questions");

            // Add progress bar
            this.addProgressBar();

            // Create questions dynamically
            questions.forEach((question, i) => {
              // Create question container
              const questionDiv = document.createElement("div");
              questionDiv.id = "question_" + i;
              questionDiv.setAttribute("role", "group");
              questionDiv.setAttribute("data-question", "true");
              questionDiv.setAttribute(
                "aria-labelledby",
                `question-title-${i}`
              );

              // Add staggered animation delay for initial load
              questionDiv.style.animationDelay = `${i * 0.1}s`;

              // Create question title
              const questionTitle = document.createElement("h3");
              questionTitle.id = `question-title-${i}`;
              questionTitle.textContent = question.node.text;
              questionDiv.appendChild(questionTitle);

              // Create answers container
              const answersContainer = document.createElement("div");
              answersContainer.setAttribute("role", "radiogroup");
              answersContainer.setAttribute("data-answers", "true");
              answersContainer.setAttribute(
                "aria-labelledby",
                `question-title-${i}`
              );

              const answers = question.node.answers.edges;
              answers.forEach((answer, j) => {
                // Create answer button
                const answerButton = document.createElement("button");
                answerButton.id = `answer_${i}_${j}`;
                answerButton.type = "button";
                answerButton.setAttribute("role", "radio");
                answerButton.setAttribute("aria-checked", "false");
                answerButton.setAttribute("tabindex", "0");
                answerButton.setAttribute(
                  "aria-describedby",
                  `question-title-${i}`
                );
                answerButton.textContent = answer.node.text;

                answerButton.addEventListener("click", (evt) => {
                  selectAnswer(evt, answer.node.id, answer.node.text);
                });
                answerButton.addEventListener("keydown", (evt) => {
                  if (evt.key === "Enter" || evt.key === " ") {
                    evt.preventDefault();
                    selectAnswer(evt, answer.node.id, answer.node.text);
                  }
                });

                // Add hover sound effect simulation (visual feedback)
                answerButton.addEventListener("mouseenter", () => {
                  answerButton.style.transform = "translateY(-2px)";
                });
                answerButton.addEventListener("mouseleave", () => {
                  if (!answerButton.hasAttribute("data-selected")) {
                    answerButton.style.transform = "translateY(0)";
                  }
                });
                answersContainer.appendChild(answerButton);
              });

              questionDiv.appendChild(answersContainer);
              this.questions.appendChild(questionDiv);
            });

            this.form.addEventListener("submit", async function (evt) {
              await onSubmitHandler(evt, quiz.id);
            });
          }

          addProgressBar() {
            const progressHTML = `
              <div>
                <div data-progress-text>Completed 0 of ${totalQuestions}</div>
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
        <div>
          <h2>⚠️ Quiz Error</h2>
          <p>${error.message}</p>
          <p>Please check your quiz settings or contact support if the problem persists.</p>
        </div>
      `;
    }
  }
});
