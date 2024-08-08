const state = {};

document.addEventListener("DOMContentLoaded", async () => {
  const api = new Gadget();

  const idInputs = document.getElementsByName("id");
  const modal = document.getElementById("new-wishlist-modal");
  const btn = document.getElementById("openModalBtn");
  const closeIcon = document.getElementsByClassName("close")[0];
  let form;
  let createSpinner;
  let createBtnText;

  idInputs[0].addEventListener("change", (event) => {
    const { value } = event?.target;

    if (value) applyCheckmarks(value);
  });

  btn.onclick = () => {
    modal.style.display = "block";

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
      }
    });
  };

  closeIcon.onclick = () => {
    if (form) form.removeEventListener("submit", () => {});
    createSpinner.style.display = "none";
    createBtnText.style.display = "block";
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      if (form) form.removeEventListener("submit", () => {});
      createSpinner.style.display = "none";
      createBtnText.style.display = "block";
      modal.style.display = "none";
    }
  };

  applyCheckmarks(window.currentVariant);

  for (const { id } of window.wishlistArr) {
    const wishlistCard = document.getElementById(`wishlist-${id}`);

    wishlistCard.addEventListener("click", async (e) => {
      const wishlistId = e.target.id.replace("wishlist-", "");

      const current = state[wishlistId];

      const checkmarkIcon = document.getElementById(`check-icon-${id}`);
      const plusIcon = document.getElementById(`plus-icon-${id}`);
      const spinner = document.getElementById(`loading-spinner-${id}`);

      spinner.style.display = "block";
      checkmarkIcon.style.display = "none";
      plusIcon.style.display = "none";

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

      spinner.style.display = "none";
    });
  }
});

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
