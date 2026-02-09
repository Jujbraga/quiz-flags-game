// Path to the flags images
const imgPath = "assets/flags/";

// Quiz varaibles
let level = ""; // Game level
let flagsData = []; // List with all flags
let shuffledFlags = []; // Countries list shuffled and sorted by level
let availableFlags = []; // Flags left to show in the current level
let flagPosition = 0; // Flag position in the list
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

  renderCard(flagPosition);
}

// Shuffle items in the array
function shuffle(array) {
  const shuffled = array.sort(() => Math.random() - 0.5);
  return shuffled;
}

function createCard(flag) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  cardElement.innerHTML = `
    <h2>Whose flag is this?</h2>
    <img class="card-flag" src="${imgPath + flag.url}">
    <p id="hint" class="hint">Show hint</p>
    <form id="card-form">
      <input type="text" name="answer" id="answer">
      <button class="button" id="submit">Submit</button>
    </form>
    <button class="button-flat" id="skip">Skip ➜</button>`;

  const cardInput = cardElement.querySelector("form input");
  // Focus the input automatically
  setTimeout(() => cardInput.focus(), 100);

  const cardHint = cardElement.querySelector("#hint");
  cardHint.addEventListener("click", () => showHint(cardHint, flag.hint), {
    once: true,
  });

  const cardForm = cardElement.querySelector("#card-form");
  cardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkAnswer(cardInput.value, flag.country);
    // Prevent to send again if enter pressed
    cardForm.innerHTML = "";
  });

  const skipButton = cardElement.querySelector("#skip");
  skipButton.addEventListener("click", () => nextFlag());

  return cardElement;
}

function renderCard(position) {
  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.innerHTML = "";
  quizContainer.classList.remove("hidden");

  const cardElement = createCard(shuffledFlags[position]);
  quizContainer.appendChild(cardElement);
}

function showHint(element, hint) {
  element.textContent = hint;
  element.classList.add("revealed");
}

function checkAnswer(answer, country) {
  const isCorrect = Object.values(country).some(
    (value) => value.toLowerCase() === answer.toLowerCase(),
  );

  createResultMessage(isCorrect ? "right" : "wrong");
}

function createResultMessage(result) {
  const config = {
    right: {
      icon: "assets/icons/check-circle.svg",
      text: "🎉 Congrats! Right answer.",
    },
    wrong: {
      icon: "assets/icons/wrong-circle.svg",
      text: "😢 Wrong answer.",
    },
  };

  const { icon, text } = config[result];

  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <div class="card ${result}">
      <img src="${icon}" />
      <h3>${text}</h3>
      <button class="button">Next</button>
    </div>`;

  const quizContainer = document.querySelector(".quiz-container");

  quizContainer.appendChild(modal);
}

function nextFlag() {
  if (flagPosition < shuffledFlags.length - 1) {
    flagPosition++;
    console.log(flagPosition);
    renderCard(flagPosition);
  } else {
    createResultMessage("final");
  }
}

getFlags("eu-flags.json");

// 1. Get data from json - OK
// 2. Set level by click - OK
// 3. Separate data by level - OK
// 4. Build the card - OK
// 5. Show each data in the card - OK
// 6. Receive the input and check answer - OK
// 7. Message: Right and Wrong -OK
// 8. Put the country in right or wrong result
// 9. Change the card
// 10. Change level
// 11. Restart game
