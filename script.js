const tinderContainer = document.querySelector(".tinder");
const cardsContainer = document.querySelector(".tinder--cards");
let currentCardIndex = 0;

const SWIPE_THRESHOLD = 100;
const CLICK_THRESHOLD = 10;

const cardData = [
  {
    // image: "image1.jpg",
    position: "Senior Software Engineer",
    currentCompany: "Google",
    prevCompanies: ["Facebook", "Amazon", "Microsoft"],
    experience: "10+ years",
    location: "San Francisco, CA",
  },
  {
    // image: "image1.jpg",
    position: "Senior Software Engineer",
    currentCompany: "Google",
    prevCompanies: ["Facebook", "Amazon", "Microsoft"],
    experience: "10+ years",
    location: "San Francisco, CA",
  },
  {
    // image: "image1.jpg",
    position: "Senior Software Engineer",
    currentCompany: "Google",
    prevCompanies: ["Facebook", "Amazon", "Microsoft"],
    experience: "10+ years",
    location: "San Francisco, CA",
  },
  {
    // image: "image1.jpg",
    position: "Senior Software Engineer",
    currentCompany: "Google",
    prevCompanies: ["Facebook", "Amazon", "Microsoft"],
    experience: "10+ years",
    location: "San Francisco, CA",
  },
];

const createCardElement = (
  { image, position, currentCompany, prevCompanies, experience, location },
  index
) => {
  const card = document.createElement("div");
  card.classList.add("tinder--card");
  card.style.zIndex = 100 - index;
  card.innerHTML = `
      <h3>${position}</h3>
      <p>${currentCompany}</p>
      <p>Previously at: ${prevCompanies.join(", ")}</p>
      <p>${experience}</p>
      <p>${location}</p>
      <div class="tinder--buttons">
        <button class="decline">
          <svg width="71" height="70" viewBox="0 0 71 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35.8325" cy="35" r="34.5" fill="url(#paint0_linear_7034_2746)" stroke="#71000D"/>
            <path d="M46.3325 24.75L25.3325 45.75" stroke="#71000D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25.3325 24.75L46.3325 45.75" stroke="#71000D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="paint0_linear_7034_2746" x1="70.8325" y1="70" x2="32.0857" y2="4.27577" gradientUnits="userSpaceOnUse">
                <stop stop-color="white"/>
                <stop offset="1" stop-color="white" stop-opacity="0.6"/>
              </linearGradient>
            </defs>
          </svg>
        </button>
        <button class="approve">
          <svg width="71" height="70" viewBox="0 0 71 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35.8325" cy="35" r="35" fill="url(#paint0_linear_7034_2742)"/>
            <path d="M49.8325 24.75L30.5825 44L21.8325 35.25" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="paint0_linear_7034_2742" x1="70.8325" y1="70" x2="41.0133" y2="-15.9787" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00B140"/>
                <stop offset="1" stop-color="#84F998"/>
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
  const moveX = direction === "left" ? "-120%" : "120%";
  const rotateDeg = direction === "left" ? "-30deg" : "30deg";

  card.style.transition = "transform 0.5s ease, opacity 0.4s ease";
  card.style.transform = `translate(${moveX}, 0) rotate(${rotateDeg})`;
  card.style.opacity = "0";

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

showInitialCards();
