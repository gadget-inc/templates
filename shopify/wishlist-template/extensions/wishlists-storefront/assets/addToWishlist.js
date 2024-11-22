const state = {};

document.addEventListener("DOMContentLoaded", async () => {
  // Instantiate your Gadget API
  window.gadgetAPI = new Gadget();

  window.wishlistObj = {};

  if (window.initialWishlistArr) {
    for (const wishlist of window.initialWishlistArr) {
      window.wishlistObj[wishlist.id] = wishlist;
    }
  }

  // idInputs holds the variant id
  const idInputs = document.getElementsByName("id");
  const modal = document.getElementById("new-wishlist-modal");
  const btn = document.getElementById("openModalBtn");
  const closeIcon = document.getElementsByClassName("close")[0];
  const wishlistContainer = document.getElementById("wishlist-container");

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

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      createSpinner.style.display = "block";
      createBtnText.style.display = "none";

      const wishlist = await window.gadgetAPI.wishlist.create({
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

        appendNewWishlist(wishlist, wishlistContainer);
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
  if (window.initialWishlistArr) {
    for (const { id } of window.initialWishlistArr) {
      const wishlistCard = document.getElementById(`wishlist-${id}`);

      // On click, add or remove the item from the wishlist
      wishlistCard.addEventListener("click", async (e) => {
        await handleWishlistClick(e);
      });
    }
  }
});

// Function to apply checkmarks to the wishlist cards
function applyCheckmarks(value) {
  if (window.currentVariant !== value) window.currentVariant = value;

  for (const { id, variants } of Object.values(wishlistObj)) {
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

function appendNewWishlist(wishlist, parent) {
  const noWishlists = document.getElementById("no-wishlists");

  if (noWishlists) noWishlists.style.display = "none";

  // Create the div element node
  const newWishlist = document.createElement("div");

  newWishlist.className = "wishlist-card";
  newWishlist.id = `wishlist-${wishlist.id}`;

  state[wishlist.id] = true;

  // Create the h4 element for the title
  const title = document.createElement("h4");
  title.className = "wishlist-title";
  title.textContent = wishlist.name;
  newWishlist.appendChild(title);

  // Create the checkmark SVG
  const checkIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  checkIcon.classList.add(["svg"]);
  checkIcon.id = `check-icon-${wishlist.id}`;
  checkIcon.setAttribute("viewBox", "0 0 24 24");
  checkIcon.style.display = "block";
  // Add the checkmark path to the SVG
  const checkPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  checkPath.setAttribute(
    "d",
    "M12,2c-5.51693,0 -10,4.48308 -10,10c0,5.51693 4.48307,10 10,10c5.51693,0 10,-4.48307 10,-10c0,-5.51692 -4.48307,-10 -10,-10zM16.49805,9c0.128,0 0.25602,0.04898 0.35352,0.14648c0.195,0.195 0.19695,0.51103 0.00195,0.70703l-6,6c-0.098,0.097 -0.22552,0.14648 -0.35352,0.14648c-0.128,0 -0.25552,-0.04948 -0.35352,-0.14648l-3,-3c-0.195,-0.195 -0.195,-0.51203 0,-0.70703c0.195,-0.195 0.51203,-0.195 0.70703,0l2.64453,2.64649l5.64648,-5.64648c0.0975,-0.0975 0.22552,-0.14648 0.35352,-0.14648z"
  );
  checkIcon.appendChild(checkPath);
  newWishlist.appendChild(checkIcon);

  // Create the plus icon SVG
  const plusIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  plusIcon.classList.add(["svg"]);
  plusIcon.id = `plus-icon-${wishlist.id}`;
  plusIcon.setAttribute("viewBox", "0 0 50 50");
  plusIcon.style.display = "none";
  // Add the plus icon path to the SVG
  const plusPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  plusPath.setAttribute(
    "d",
    "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"
  );
  plusIcon.appendChild(plusPath);
  newWishlist.appendChild(plusIcon);

  // Create the loading spinner div
  const spinner = document.createElement("div");
  spinner.className = "spinner";
  spinner.id = `loading-spinner-${wishlist.id}`;
  spinner.style.display = "none";
  newWishlist.appendChild(spinner);

  // Attach event listener to the new div
  newWishlist.addEventListener("click", async (e) => {
    await handleWishlistClick(e);
  });

  parent.appendChild(newWishlist);
}

async function handleWishlistClick(e) {
  const wishlistId = e.target.id.replace("wishlist-", "");

  // Get the current state of the wishlist item
  const current = state[wishlistId];

  const checkmarkIcon = document.getElementById(`check-icon-${wishlistId}`);
  const plusIcon = document.getElementById(`plus-icon-${wishlistId}`);
  const spinner = document.getElementById(`loading-spinner-${wishlistId}`);

  // Change the icons to the spinner
  spinner.style.display = "block";
  checkmarkIcon.style.display = "none";
  plusIcon.style.display = "none";

  // If the item is already in the wishlist, remove it
  if (current) {
    const deleteResponse = await window.gadgetAPI.removeFromWishlist({
      wishlistId,
      shopId: window.shopId.toString(),
      customerId: window.customerId.toString(),
      variantId: window.currentVariant.toString(),
    });

    plusIcon.style.display = "block";

    if (deleteResponse.success) state[wishlistId] = false;
  } else {
    // If the item is not in the wishlist, add it
    const addResponse = await window.gadgetAPI.wishlistItem.create({
      wishlist: {
        _link: wishlistId,
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

    if (addResponse) state[wishlistId] = true;
  }

  // Hide the spinner
  spinner.style.display = "none";
}
