const tinderContainer = document.querySelector(".tinder");
const cardsContainer = document.querySelector(".tinder--cards");
let currentCardIndex = 0;

const SWIPE_THRESHOLD = 100;
const CLICK_THRESHOLD = 10;

const generateCardData = (numCards) => {
  const positions = [
    "Senior Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer",
  ];

  const companies = [
    { name: "Google", url: "https://google.com" },
    { name: "Facebook", url: "https://facebook.com" },
    { name: "Amazon", url: "https://amazon.com" },
    { name: "Microsoft", url: "https://microsoft.com" },
    { name: "Netflix", url: "https://netflix.com" },
    { name: "Apple", url: "https://apple.com" },
  ];

  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Seattle, WA",
    "Austin, TX",
    "Boston, MA",
    "Chicago, IL",
  ];

  const experienceLevels = ["1", "3", "5", "7", "10", "15"];

  const getRandomItem = (array) =>
    array[Math.floor(Math.random() * array.length)];

  const generateCompanies = () => {
    const numCompanies = Math.floor(Math.random() * 2) + 1; // 1 or 2 companies
    return Array.from({ length: numCompanies }, () => {
      const company = getRandomItem(companies);
      return {
        name: company.name,
        position: getRandomItem(positions),
        url: company.url,
      };
    });
  };

  return Array.from({ length: numCards }, () => ({
    companies: generateCompanies(),
    experience: getRandomItem(experienceLevels),
    location: getRandomItem(locations),
  }));
};

const cardData = generateCardData(5);

const getCompanyFavicon = (url) => {
  if (!url) return "";
  const domain = new URL(url).hostname;
  return `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`;
};

const createCardElement = ({ companies, experience, location }, index) => {
  const card = document.createElement("div");
  card.classList.add("tinder--card");
  card.style.zIndex = 100 - index;

  // Card content
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
