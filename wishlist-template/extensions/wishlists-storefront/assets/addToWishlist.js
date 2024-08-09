const state = {};

document.addEventListener("DOMContentLoaded", async () => {
  // Instantiate your Gadget API
  const api = new Gadget();

  // idInputs holds the variant id
  const idInputs = document.getElementsByName("id");
  const modal = document.getElementById("new-wishlist-modal");
  const btn = document.getElementById("openModalBtn");
  const closeIcon = document.getElementsByClassName("close")[0];
  let form;
  let createSpinner;
  let createBtnText;

  // Setting an event listener in case the selected variant changes
  idInputs[0].addEventListener("change", (event) => {
    const { value } = event?.target;

    if (value) applyCheckmarks(value);
  });

  // Event listener for the modal open button
  btn.onclick = () => {
    modal.style.display = "block";

    // Getting the tags from the modal
    form = document.getElementById("new-wishlist-form");
    createSpinner = document.getElementById("creation-spinner");
    createBtnText = document.getElementById("create-button-text");

    console.log({ form, createSpinner, createBtnText });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      createSpinner.style.display = "block";
      createBtnText.style.display = "none";

      const wishlist = await api.wishlist.create({
        name: document.getElementById("new-wishlist-input").value,
        shop: {
          _link: window.shopId,
        },
        customer: {
          _link: window.customerId,
        },
        wishlistItems: [
          {
            create: {
              variant: {
                _link: window.currentVariant,
              },
              shop: {
                _link: window.shopId,
              },
              customer: {
                _link: window.customerId,
              },
            },
          },
        ],
      });

      if (wishlist) {
        form.removeEventListener("submit", () => {});
        createSpinner.style.display = "none";
        createBtnText.style.display = "block";
        modal.style.display = "none";
      } else {
        createSpinner.style.display = "none";
        createBtnText.style.display = "block";
        // Add error displaying logic here
      }
    });
  };

  // Event listener for the modal close button
  closeIcon.onclick = () => {
    if (form) form.removeEventListener("submit", () => {});
    createSpinner.style.display = "none";
    createBtnText.style.display = "block";
    modal.style.display = "none";
  };

  // Event listener for clicking outside the modal
  window.onclick = (event) => {
    if (event.target === modal) {
      if (form) form.removeEventListener("submit", () => {});
      createSpinner.style.display = "none";
      createBtnText.style.display = "block";
      modal.style.display = "none";
    }
  };

  // Applying checkmarks to the wishlist cards on initial load
  applyCheckmarks(window.currentVariant);

  // Loop through each wishlist in the array and add an event listener for it
  for (const { id } of window.wishlistArr) {
    const wishlistCard = document.getElementById(`wishlist-${id}`);

    // On click, add or remove the item from the wishlist
    wishlistCard.addEventListener("click", async (e) => {
      const wishlistId = e.target.id.replace("wishlist-", "");

      // Get the current state of the wishlist item
      const current = state[wishlistId];

      const checkmarkIcon = document.getElementById(`check-icon-${id}`);
      const plusIcon = document.getElementById(`plus-icon-${id}`);
      const spinner = document.getElementById(`loading-spinner-${id}`);

      // Change the icons to the spinner
      spinner.style.display = "block";
      checkmarkIcon.style.display = "none";
      plusIcon.style.display = "none";

      // If the item is already in the wishlist, remove it
      if (current) {
        const deleteResponse = await api.removeFromWishlist({
          wishlistId,
          shopId: window.shopId.toString(),
          customerId: window.customerId.toString(),
          variantId: window.currentVariant.toString(),
        });

        plusIcon.style.display = "block";

        if (deleteResponse.success) state[id] = false;
      } else {
        // If the item is not in the wishlist, add it
        const addResponse = await api.wishlistItem.create({
          wishlist: {
            _link: id,
          },
          shop: {
            _link: window.shopId,
          },
          customer: {
            _link: window.customerId,
          },
          variant: {
            _link: window.currentVariant,
          },
        });

        checkmarkIcon.style.display = "block";

        if (addResponse) state[id] = true;
      }

      // Hide the spinner
      spinner.style.display = "none";
    });
  }
});

// Function to apply checkmarks to the wishlist cards
function applyCheckmarks(value) {
  if (window.currentVariant !== value) window.currentVariant = value;

  for (const { id, variants } of window.wishlistArr) {
    const checkmarkIcon = document.getElementById(`check-icon-${id}`);
    const plusIcon = document.getElementById(`plus-icon-${id}`);

    if (!checkmarkIcon || !plusIcon) continue;

    if (variants[value]) {
      checkmarkIcon.style.display = "block";
      plusIcon.style.display = "none";

      state[id] = true;
    } else {
      checkmarkIcon.style.display = "none";
      plusIcon.style.display = "block";

      state[id] = false;
    }
  }
}
