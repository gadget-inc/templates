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

  try {
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

    // Filter out answers that don't have recommendations and log for debugging
    const validRecommendations = recommendedProducts.filter(
      (result) => result.recommendedProduct?.productSuggestion
    );

    // Hide the form and show the results
    document.querySelector(".quiz-form").style.display = "none";

    // Get the results container
    const resultsContainer = document.getElementById("quiz-results");
    const recommendationsGrid = document.getElementById("recommendations-grid");

    // Clear any existing recommendations
    recommendationsGrid.innerHTML = "";

    if (validRecommendations.length === 0) {
      recommendationsGrid.innerHTML = `
      <div class="recommendation-card">
        <h3>No specific recommendations found</h3>
        <p>Thank you for taking our quiz!</p>
      </div>
    `;
    } else {
      validRecommendations.forEach((result, index) => {
        const { recommendedProduct } = result;
        const productSuggestion = recommendedProduct.productSuggestion;

        if (!productSuggestion) {
          console.warn(
            "Missing product suggestion for recommendation:",
            recommendedProduct
          );
          return;
        }

        const productTitle = productSuggestion.title;

        // Use Shopify's product image placeholder if no image is available
        const displayImage =
          productSuggestion.media?.edges?.[0]?.node?.image?.originalSrc ||
          `https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081`;

        const recommendationCard = document.createElement("div");
        recommendationCard.className = "recommendation-card";
        recommendationCard.style.animationDelay = `${index * 0.2}s`;
        recommendationCard.innerHTML = `
        <h3>${productTitle}</h3>
        <img src="${displayImage}" alt="${productTitle}" loading="lazy">
        <p>Price available on product page</p>
        <a href="/products/${productSuggestion.handle}">View Product</a>
      `;

        recommendationsGrid.appendChild(recommendationCard);
      });
    }

    // Hide the form and show the results
    document.querySelector(".quiz-form").style.display = "none";
    resultsContainer.classList.remove("hidden");
  } catch (error) {
    console.error("Error submitting quiz:", error);

    // Reset button state
    submitButton.disabled = false;
    if (buttonText) buttonText.style.display = "inline";
    if (buttonLoading) buttonLoading.style.display = "none";

    // Hide the form and show error in results
    document.querySelector(".quiz-form").style.display = "none";

    const resultsContainer = document.getElementById("quiz-results");
    const recommendationsGrid = document.getElementById("recommendations-grid");

    recommendationsGrid.innerHTML = `
      <div class="recommendation-card">
        <h3>⚠️ Something went wrong</h3>
        <p>We encountered an error while processing your quiz. Please try again.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;

    resultsContainer.classList.remove("hidden");
  }
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

    // Check if quiz_slug is set
    if (!window.quiz_slug) {
      throw new Error("Quiz slug not found. Please check your theme settings.");
    }

    const quiz = await window.api.quiz.maybeFindBySlug(window.quiz_slug, {
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
        `No quiz found with slug: ${window.quiz_slug}. Please check your quiz settings.`
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
