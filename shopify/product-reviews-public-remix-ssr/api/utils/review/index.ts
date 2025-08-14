import { Liquid } from "liquidjs";

const engine = new Liquid();

export const invalidTokenTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invalid Review Token</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f6f6f7; }
        .error-container { max-width: 600px; margin: 50px auto; text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .error-icon { font-size: 48px; color: #d82c0d; margin-bottom: 20px; }
        h1 { color: #202223; margin-bottom: 16px; }
        p { color: #6d7175; line-height: 1.5; }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">❌</div>
        <h1>Invalid Review Token</h1>
        <p>The review link you're trying to access is invalid or has expired. Please check your email for the correct link or contact customer support.</p>
    </div>
</body>
</html>
`;

const mainTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Product Reviews</title>
    <style>
        * { box-sizing: border-box; }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f6f6f7; 
            line-height: 1.5;
        }
        
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
        }
        
        .review-card { 
            background: white; 
            border-radius: 8px; 
            padding: 24px; 
            margin-bottom: 20px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        }
        
        .review-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 20px; 
        }
        
        .review-product { 
            display: flex; 
            align-items: center; 
            gap: 16px; 
        }
        
        .review-thumbnail { 
            width: 60px; 
            height: 60px; 
            object-fit: cover; 
            border-radius: 8px; 
            border: 1px solid #e1e3e5; 
        }
        
        .review-title { 
            margin: 0; 
            color: #202223; 
            font-size: 18px; 
            font-weight: 600; 
        }
        
        .review-status { 
            display: flex; 
            align-items: center; 
            gap: 8px; 
            color: #008060; 
        }
        
        .status-icon { 
            font-size: 20px; 
        }
        
        .review-status h3 { 
            margin: 0; 
            font-size: 16px; 
            font-weight: 500; 
        }
        
        .review-toggle { 
            margin-bottom: 20px; 
        }
        
        .toggle-button { 
            background: #008060; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 14px; 
            font-weight: 500; 
            transition: background-color 0.2s; 
        }
        
        .toggle-button:hover { 
            background: #006b4f; 
        }
        
        .review-collapsible { 
            border-top: 1px solid #e1e3e5; 
            padding-top: 20px; 
        }
        
        .review-form { 
            display: flex; 
            flex-direction: column; 
            gap: 20px; 
        }
        
        .stars-input { 
            display: flex; 
            flex-direction: column; 
            gap: 8px; 
        }
        
        .stars-container { 
            display: flex; 
            gap: 4px; 
        }
        
        .star { 
            font-size: 24px; 
            color: #d1d5db; 
            cursor: pointer; 
            transition: color 0.2s; 
        }
        
        .star:hover, .star.active { 
            color: #fbbf24; 
        }
        
        .rating-text { 
            font-size: 14px; 
            color: #6d7175; 
        }
        
        .form-group { 
            position: relative; 
        }
        
        .review-textarea { 
            width: 100%; 
            padding: 12px; 
            border: 1px solid #c9ccd1; 
            border-radius: 6px; 
            font-family: inherit; 
            font-size: 14px; 
            resize: vertical; 
            min-height: 100px; 
        }
        
        .review-textarea:focus { 
            outline: none; 
            border-color: #008060; 
            box-shadow: 0 0 0 3px rgba(0,128,96,0.1); 
        }
        
        .char-count { 
            position: absolute; 
            bottom: 8px; 
            right: 12px; 
            font-size: 12px; 
            color: #6d7175; 
            background: white; 
            padding: 2px 6px; 
        }
        
        .review-actions { 
            display: flex; 
            justify-content: flex-end; 
        }
        
        .btn-primary { 
            background: #008060; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 14px; 
            font-weight: 500; 
            transition: background-color 0.2s; 
        }
        
        .btn-primary:hover { 
            background: #006b4f; 
        }
        
        .btn-primary:disabled { 
            background: #c9ccd1; 
            cursor: not-allowed; 
        }
        
        @media (max-width: 600px) {
            .review-header { 
                flex-direction: column; 
                align-items: flex-start; 
                gap: 16px; 
            }
            
            .review-product { 
                flex-direction: column; 
                align-items: flex-start; 
                gap: 12px; 
            }
            
            .review-thumbnail { 
                width: 80px; 
                height: 80px; 
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="text-align: center; margin-bottom: 32px; color: #202223;">Product Reviews</h1>
        {% for product in products %}
          <div class="review-card">
            <div class="review-header">
              <div class="review-product">
                <img 
                  src="{{ product.image | default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjZGNEY3Ii8+CjxwYXRoIGQ9Ik0yMCAxMEMyMi43NjEgMTAgMjUgMTIuMjM5IDI1IDE1QzI1IDE3Ljc2MSAyMi43NjEgMjAgMjAgMjBDMTcuMjM5IDIwIDE1IDE3Ljc2MSAxNSAxNUMxNSAxMi4yMzkgMTcuMjM5IDEwIDIwIDEwWiIgZmlsbD0iI0M5Q0FBNyIvPgo8L3N2Zz4K' }}" 
                  alt="{{ product.alt | default: 'Image placeholder' }}" 
                  class="review-thumbnail"
                >
                <h2 class="review-title">{{ product.title }}</h2>
              </div>

              {% if product.reviewCreated %}
                <div class="review-status">
                  <span class="status-icon">✅</span>
                  <h3>Review completed!</h3>
                </div>
              {% endif %}
            </div>

            {% unless product.reviewCreated %}
              <div class="review-toggle">
                <button type="button" class="toggle-button" data-target="collapsible-{{ product.id }}">
                  Write a review
                </button>
              </div>

              <div id="collapsible-{{ product.id }}" class="review-collapsible" style="display: none;">
                <form action="/api/review/create" method="post" class="review-form">
                  <input type="hidden" name="orderId" value="{{ orderId }}">
                  <input type="hidden" name="productId" value="{{ product.id }}">
                  <input type="hidden" name="lineItemId" value="{{ product.lineItemId }}">
                  <input type="hidden" name="rating" value="0" id="rating-{{ product.id }}">

                  <div class="stars-input">
                    <div class="stars-container" data-product-id="{{ product.id }}">
                      <span class="star" data-rating="1">★</span>
                      <span class="star" data-rating="2">★</span>
                      <span class="star" data-rating="3">★</span>
                      <span class="star" data-rating="4">★</span>
                      <span class="star" data-rating="5">★</span>
                    </div>
                    <div class="rating-text">Click to rate</div>
                  </div>

                  <div class="form-group">
                    <textarea 
                      name="content" 
                      rows="4" 
                      maxlength="500" 
                      placeholder="Write your review..." 
                      class="review-textarea"
                      required
                    ></textarea>
                    <div class="char-count"><span class="current-count">0</span>/500</div>
                  </div>

                  <div class="review-actions">
                    <button type="submit" class="btn-primary">Submit review</button>
                  </div>
                </form>
              </div>
            {% endunless %}
          </div>
        {% endfor %}
    </div>

    <script>
        // Toggle collapsible sections
        document.addEventListener("click", function(e) {
            if (e.target.matches(".toggle-button")) {
                var target = document.getElementById(e.target.dataset.target);
                if (target.style.display === "none") {
                    target.style.display = "block";
                    e.target.textContent = "Close";
                } else {
                    target.style.display = "none";
                    e.target.textContent = "Write a review";
                }
            }
        });

        // Star rating functionality
        document.addEventListener("click", function(e) {
            if (e.target.matches(".star")) {
                const starsContainer = e.target.closest(".stars-container");
                const productId = starsContainer.dataset.productId;
                const rating = parseInt(e.target.dataset.rating);
                const ratingInput = document.getElementById("rating-" + productId);
                
                // Update hidden input
                ratingInput.value = rating;
                
                // Update star display
                const stars = starsContainer.querySelectorAll(".star");
                stars.forEach((star, index) => {
                    if (index < rating) {
                        star.classList.add("active");
                    } else {
                        star.classList.remove("active");
                    }
                });
                
                // Update rating text
                const ratingText = starsContainer.nextElementSibling;
                ratingText.textContent = rating + " star" + (rating > 1 ? "s" : "");
            }
        });

        // Character count for textarea
        document.addEventListener("input", function(e) {
            if (e.target.matches(".review-textarea")) {
                const textarea = e.target;
                const charCount = textarea.parentElement.querySelector(".char-count .current-count");
                charCount.textContent = textarea.value.length;
            }
        });

        // Form submission handling
        document.addEventListener("submit", function(e) {
            if (e.target.matches(".review-form")) {
                const form = e.target;
                const submitBtn = form.querySelector(".btn-primary");
                const ratingInput = form.querySelector("input[name='rating']");
                const contentInput = form.querySelector("textarea[name='content']");
                
                // Basic validation
                if (parseInt(ratingInput.value) === 0) {
                    e.preventDefault();
                    alert("Please select a rating before submitting.");
                    return;
                }
                
                if (!contentInput.value.trim()) {
                    e.preventDefault();
                    alert("Please write a review before submitting.");
                    return;
                }
                
                // Disable submit button to prevent double submission
                submitBtn.disabled = true;
                submitBtn.textContent = "Submitting...";
            }
        });
    </script>
</body>
</html>
`;

export async function generateReviewTemplate(data: {
  orderId: string;
  products: Array<{
    id: string;
    title: string;
    image: string;
    alt: string;
    reviewCreated: boolean;
    lineItemId: string;
  }>;
}): Promise<string> {
  const { orderId, products } = data;

  // Prepare the context for LiquidJS
  const context = {
    orderId,
    products: products.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.image,
      alt: product.alt,
      reviewCreated: product.reviewCreated,
      lineItemId: product.lineItemId,
    })),
  };

  // Render the template with LiquidJS
  return await engine.parseAndRender(mainTemplate, context);
}
