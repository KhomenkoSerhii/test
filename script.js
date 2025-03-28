const tinderContainer = document.querySelector(".tinder");
const cardsContainer = document.querySelector(".tinder--cards");
let currentCardIndex = 0;

const SWIPE_THRESHOLD = 100;
const CLICK_THRESHOLD = 10;

const cardData = [
  {
    id: "1",
    companies: [
      {
        name: "Facebook",
        position: "UI/UX Designer",
        url: "https://facebook.com",
      },
    ],
    experience: "10",
    location: "Boston, MA",
  },
  {
    id: "2",
    companies: [
      {
        name: "Facebook",
        position: "Frontend Developer",
        url: "https://facebook.com",
      },
    ],
    experience: "3",
    location: "New York, NY",
  },
  {
    id: "3",
    companies: [
      {
        name: "Microsoft",
        position: "DevOps Engineer",
        url: "https://microsoft.com",
      },
    ],
    experience: "15",
    location: "San Francisco, CA",
  },
  {
    id: "4",
    companies: [
      {
        name: "Amazon",
        position: "Full Stack Developer",
        url: "https://amazon.com",
      },
    ],
    experience: "3",
    location: "Chicago, IL",
  },
  {
    id: "5",
    companies: [
      {
        name: "Amazon",
        position: "UI/UX Designer",
        url: "https://amazon.com",
      },
      {
        name: "Apple",
        position: "Full Stack Developer",
        url: "https://apple.com",
      },
    ],
    experience: "5",
    location: "Austin, TX",
  },
];

// Initialize arrays to store accepted and declined user IDs
const acceptedUsers = JSON.parse(localStorage.getItem("acceptedUsers")) || [];
const declinedUsers = JSON.parse(localStorage.getItem("declinedUsers")) || [];

// Function to update local storage
const updateLocalStorage = () => {
  localStorage.setItem("acceptedUsers", JSON.stringify(acceptedUsers));
  localStorage.setItem("declinedUsers", JSON.stringify(declinedUsers));
};

const bookACall = () => {
  window.open("https://calendly.com/callum-calyptus/15m", "_blank");
};

const continueSwiping = () => {
  document.querySelector(".modal").remove();
};

// Function to show the "Book a Call" modal
const showBookCallModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
      <div class="modal-content card">
        <h2>We have ${acceptedUsers.length} top <br/> matches!</h2>
        <p>Congrats! Book a call with our Co-Founder now to run through your candidates.</p>
        <div>
        <button class="book-call"
            type="button"
            onclick="bookACall()"
        >Book a Call</button>
        <button
            class="close-modal"
            type="button"
            onclick="continueSwiping()"
        class="book-call">Continue Swiping</button>
         </div>
      </div>
    `;
  document.body.appendChild(modal);

  // Close modal functionality
  const closeModalButton = modal.querySelector(".close-modal");
  closeModalButton.addEventListener("click", () => {
    modal.remove();
  });
};
const getCompanyFavicon = (url) => {
  if (!url) return "";
  const domain = new URL(url).hostname;
  return `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`;
};

const createCardElement = ({ id, companies, experience, location }, index) => {
  const card = document.createElement("div");
  card.classList.add("tinder--card");
  card.classList.add("card");

  card.style.zIndex = 100 - index;
  card.setAttribute("data-id", id);

  card.innerHTML = `
  <article>
    <div class="details">
      <div class="company">
        <div class="company--header">
          <img src="${getCompanyFavicon(
            companies[0].url
          )}" alt="Company Logo" />
          <h3>${companies[0].name}</h3>
        </div>
        <h1>${companies[0].position}</h1>
      </div>
    </div>

    <div class="card-info">
    <div class="additional">
      <div>
        <p>Previous role:</p>
        <div>
          <span>${companies[0].position}, &nbsp</span>
          <span>${companies[0].name}</span>
          <img src="${getCompanyFavicon(
            companies[0].url
          )}" alt="Company Logo" />
        </div>
      </div>
    </div>

    <div class="additional">
      <p>Location:</p>
      <span>${location}</span>
    </div>

    <div class="additional">
      <p>Experience:</p>
      <span>${experience} ${
    experience > 1 ? "yrs of experience" : "year of experience"
  }</span>
    </div>
    </div>
  </article>

  <div class="tinder--buttons">
    <button class="decline">
      <svg width="71" height="70" viewBox="0 0 71 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35.8325" cy="35" r="34.5" fill="url(#paint0_linear_7034_2746)" stroke="#71000D" />
        <path d="M46.3325 24.75L25.3325 45.75" stroke="#71000D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M25.3325 24.75L46.3325 45.75" stroke="#71000D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        <defs>
          <linearGradient id="paint0_linear_7034_2746" x1="70.8325" y1="70" x2="32.0857" y2="4.27577" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    </button>
    <button class="approve">
      <svg width="71" height="70" viewBox="0 0 71 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35.8325" cy="35" r="35" fill="url(#paint0_linear_7034_2742)" />
        <path d="M49.8325 24.75L30.5825 44L21.8325 35.25" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        <defs>
          <linearGradient id="paint0_linear_7034_2742" x1="70.8325" y1="70" x2="41.0133" y2="-15.9787" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00B140" />
            <stop offset="1" stop-color="#84F998" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  </div>
`;
  return card;
};

const resetCardPosition = (card) => {
  card.style.transition = "transform 0.3s ease";
  card.style.transform = "translate(0, 0) rotate(0deg)";
};

const handleSwipe = (card, direction) => {
  const cardId = card.getAttribute("data-id");
  const moveX = direction === "left" ? "-120%" : "120%";
  const rotateDeg = direction === "left" ? "-30deg" : "30deg";

  card.style.transition = "transform 0.5s ease, opacity 0.4s ease";
  card.style.transform = `translate(${moveX}, 0) rotate(${rotateDeg})`;
  card.style.opacity = "0";

  // Store the card ID in the appropriate array
  if (direction === "right") {
    acceptedUsers.push(cardId);

    // Trigger the modal after 2 "yes" actions and every "yes" action after that
    if (acceptedUsers.length === 2 || acceptedUsers.length > 2) {
      showBookCallModal();
    }
  } else if (direction === "left") {
    declinedUsers.push(cardId);
  }

  updateLocalStorage();

  // Load next card below current
  if (currentCardIndex < cardData.length) {
    const nextCard = createCardElement(
      cardData[currentCardIndex],
      currentCardIndex
    );
    cardsContainer.insertBefore(nextCard, cardsContainer.firstChild);
    initializeCard(nextCard);
    currentCardIndex++;
  }

  // Remove old after transition
  setTimeout(() => {
    card.remove();
  }, 500);
};

const initializeCard = (card) => {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const updatePosition = () => {
    const diffX = currentX - startX;
    card.style.transform = `translate(${diffX}px, 0) rotate(${diffX * 0.1}deg)`;
  };

  const onDragMove = (x) => {
    currentX = x;
    requestAnimationFrame(updatePosition);
  };

  const onDragEnd = () => {
    const diffX = currentX - startX;
    isDragging = false;

    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      handleSwipe(card, diffX > 0 ? "right" : "left");
    } else if (Math.abs(diffX) < CLICK_THRESHOLD) {
      resetCardPosition(card);
    }
  };

  // Touch Events
  card.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchmove", (e) => {
    if (isDragging) onDragMove(e.touches[0].clientX);
  });

  card.addEventListener("touchend", () => {
    if (isDragging) onDragEnd();
  });

  // Mouse Events
  card.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;

    const onMouseMove = (e) => onDragMove(e.clientX);
    const onMouseUp = () => {
      onDragEnd();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  const declineBtn = card.querySelector(".decline");
  const approveBtn = card.querySelector(".approve");

  declineBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleSwipe(card, "left");
  });

  approveBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleSwipe(card, "right");
  });
};

const showInitialCards = (count = 2) => {
  for (let i = 0; i < count && currentCardIndex < cardData.length; i++) {
    const card = createCardElement(
      cardData[currentCardIndex],
      currentCardIndex
    );
    cardsContainer.appendChild(card);
    initializeCard(card);
    currentCardIndex++;
  }
};
const removeCardWithHighestZIndex = (direction) => {
  const cards = [...document.querySelectorAll(".tinder--card")];
  if (cards.length === 0) return;

  const topCard = cards.reduce((highest, card) => {
    const currentZ = parseInt(window.getComputedStyle(card).zIndex || "0");
    const highestZ = parseInt(window.getComputedStyle(highest).zIndex || "0");
    return currentZ > highestZ ? card : highest;
  }, cards[0]);

  handleSwipe(topCard, direction);
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    removeCardWithHighestZIndex("right");
  } else if (event.key === "ArrowLeft") {
    removeCardWithHighestZIndex("left");
  }
});
showInitialCards();
