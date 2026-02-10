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
  levelOptions.classList.remove("hidden");

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
    <span>${flagPosition + 1} of ${shuffledFlags.length}</span>
    <h2>Whose flag is this?</h2>
    <img class="card-flag" src="${imgPath + flag.url}">
    <p id="hint" class="hint">Show hint</p>
    <form id="card-form" autocomplete="off">
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
    checkAnswer(cardInput.value, flag);
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

function checkAnswer(answer, flag) {
  // Check if the answer given is correct
  const isCorrect = Object.values(flag.country).some(
    (value) => value.toLowerCase() === answer.toLowerCase(),
  );

  isCorrect ? rightAnswers.push(flag) : wrongAnswers.push(flag);

  createResultMessage(isCorrect ? "right" : "wrong");
}

function createResultMessage(result) {
  const config = {
    right: {
      icon: "assets/icons/check-circle.svg",
      text: "🎉 Congrats! Right answer.",
      clickRedirect: nextFlag,
    },
    wrong: {
      icon: "assets/icons/wrong-circle.svg",
      text: "😢 Wrong answer.",
      clickRedirect: nextFlag,
    },
    final: {
      text: `You’ve reached the end of the ${level} level. Let’s see how you did!`,
      clickRedirect: renderResult,
    },
  };

  const { icon, text, clickRedirect } = config[result];

  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <div class="card ${result}">
    ${icon ? `<img src="${icon}" />` : ""}
      <h3>${text}</h3>
      <button id="result-button" class="button">
        ${result === "final" ? `See result` : `Next`}
      </button>
    </div>`;

  const button = modal.querySelector("#result-button");
  button.addEventListener("click", () => clickRedirect());
  // Focus the button automatically to work with enter key
  setTimeout(() => button.focus(), 100);

  const quizContainer = document.querySelector(".quiz-container");

  quizContainer.appendChild(modal);
}

function nextFlag() {
  if (flagPosition < shuffledFlags.length - 1) {
    flagPosition++;
    renderCard(flagPosition);
  } else {
    createResultMessage("final");
  }
}

function renderResult() {
  // Hide the card container
  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.innerHTML = "";
  quizContainer.classList.add("hidden");

  const result = document.querySelector(".result-container");
  result.classList.remove("hidden");

  // Show the number of right answers
  const rightCount = result.querySelector("#right-count");
  rightCount.innerHTML = `${rightAnswers.length} right answers`;

  // Show the number of wrong answers
  const wrongCount = result.querySelector("#wrong-count");
  wrongCount.innerHTML = `${wrongAnswers.length} wrong answers`;

  const rightBox = document.querySelector("#right-results");
  const wronBox = document.querySelector("#wrong-results");

  const restartWrapper = document.createElement("div");
  restartWrapper.classList.add("button-wrapper", "wrapper-restart");
  restartWrapper.innerHTML = `
    <button id="again" class="button">Play again</button>
  `;

  const restartButton = restartWrapper.querySelector("#again");
  restartButton.addEventListener("click", () => {
    restartButton.remove();
    restartGame();
  });
  result.after(restartWrapper);

  // Render the right and wrong blocks
  rightAnswers.forEach((flag) => createResults(rightBox, flag));
  wrongAnswers.forEach((flag) => createResults(wronBox, flag));
}

function createResults(container, flag) {
  container.innerHTML += `
    <div>
      <img src="${imgPath + flag.url}" />
      <p>${flag.country.en}</p>
    </div>
  `;
}

function restartGame() {
  // Clear answers variables
  rightAnswers = [];
  wrongAnswers = [];

  // Hide the result container
  const result = document.querySelector(".result-container");
  result.classList.add("hidden");

  setLevel();
}

getFlags("eu-flags.json");

// 1. regex para aceitar somente letras e acentos
// 2. trim para retirar espaços em branco do input
// 3. desabilitar sugestões - OK
// 4. menssagem final com level easy apenas, deixar dinâmico - OK
// 3. Abrir as respostas corretas ao passar o mouse por cima ou clicar no celular
// 4. Dicas mais fáceis no nível hard
// ERROS
// 1. Ao clicar para jogar again só deixa jogar 1 bandeira
// 2. Botões jogar again repetidos - OK
// 3. Flags skip não aparece em Wrong
