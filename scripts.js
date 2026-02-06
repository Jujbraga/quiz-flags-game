// Path to the flags images
const imgPath = "assets/flags/";

// Quiz varaibles
let level = ""; // Game level
let flagsData = []; // List with all flags
let shuffledFlags = []; // Countries list shuffled and sorted by level
let availableFlags = []; // Flags left to show in the current level
let rightAnswers = []; // List of the right answers
let wrongAnswers = []; // List of the wrong answers

// Get the countries in JSON file and initiate game
async function getFlags(file) {
  try {
    const response = await fetch(file);
    const data = await response.json();

    // Assign the JSON result to variable
    flagsData = data.levels;

    // Set the level
    setLevel();
  } catch (error) {
    console.error("Failed to load flags:", error);
  }
}

function setLevel() {
  const levelOptions = document.querySelector(".level-options");

  levelOptions.addEventListener("click", (e) => {
    // Find the button element with the data attribute
    const btn = e.target.closest("[data-level]");

    // Set level to dataset value
    level = btn.dataset.level;

    // Hide the level options
    levelOptions.classList.add("hidden");

    // Start Game
    initGame(level);
  });
}

function initGame(level) {
  // Get only the flags in the selected level
  const levelFlags = flagsData.find((l) => l.difficulty === level).data;

  // Shuffle the flags
  shuffledFlags = shuffle(levelFlags);

  renderCard();
}

// Shuffle items in the array
function shuffle(array) {
  const shuffled = array.sort(() => Math.random() - 0.5);
  return shuffled;
}

function createCard(country) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  const cardTitle = document.createElement("h2");
  cardTitle.textContent = "Whose flag is this?";

  const cardImg = document.createElement("img");
  cardImg.classList.add("card-flag");
  cardImg.setAttribute("src", imgPath + country.url);

  const cardHint = document.createElement("p");
  cardHint.classList.add("hint");
  cardHint.textContent = "Show hint";
  cardHint.addEventListener("click", () => showHint(cardHint, country), {
    once: true,
  });

  const cardInput = document.createElement("input");
  cardInput.setAttribute("type", "text");
  cardInput.setAttribute("name", "answer");
  cardInput.setAttribute("id", "answer");

  const submitButton = document.createElement("button");
  submitButton.classList.add("button");
  submitButton.setAttribute("id", "submit-button");
  submitButton.textContent = "Submit";

  const skipButton = document.createElement("button");
  skipButton.classList.add("button-flat");
  skipButton.setAttribute("id", "skip-button");
  skipButton.textContent = "Skip ➜";

  cardElement.append(
    cardTitle,
    cardImg,
    cardHint,
    cardInput,
    submitButton,
    skipButton,
  );

  return cardElement;
}

function renderCard() {
  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.classList.remove("hidden");

  const cardElement = createCard(shuffledCountries[0]);
  quizContainer.appendChild(cardElement);
}

function showHint(element, country) {
  element.textContent = country.hint;
  element.classList.add("revealed");
}

getFlags("eu-flags.json");

// 1. Get data from json - OK
// 2. Set level by click - OK
// 3. Separate data by level - OK
// 4. Build the card - OK
// 5. Show each data in the card - OK
// 6. Receive the input and check answer
// 7. Message: Right and Wrong
// 8. Put the country in right or wrong result
// 9. Change the card
// 10. Change level
// 11. Restart game
