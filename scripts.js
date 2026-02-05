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

    // Start Game
    initGame(level);
  });
}

function initGame(level) {
  // Get only the flags in the selected level
  const levelFlags = flagsData.find((l) => l.difficulty === level).data;

  // Shuffle the flags
  shuffledFlags = shuffle(levelFlags);

  console.log(shuffledFlags);
}

// Shuffle items in the array
function shuffle(array) {
  const shuffled = array.sort(() => Math.random() - 0.5);
  return shuffled;
}

getFlags("eu-flags.json");

// 1. Get data from json - OK
// 2. Set level by click - OK
// 3. Separate data by level - OK
// 4. Build the card
// 5. Show each data in the card
// 6. Receive the input and check answer
// 7. Message: Right and Wrong
// 8. Put the country in right or wrong result
// 9. Change the card
