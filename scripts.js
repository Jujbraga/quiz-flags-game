// Path to the flags images
const imgPath = "assets/flags/";

// Quiz varaibles
let level = 1; // Game level
let flagsData = []; // List with all flags
let shuffledData = []; // Countries list shuffled and sorted by level
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

    // Start the game
    initGame();
  } catch (error) {
    console.error("Failed to load flags:", error);
  }
}

function initGame() {
  const easyMode = flagsData.find((l) => l.difficulty === "easy").data;
  const mediumMode = flagsData.find((l) => l.difficulty === "medium").data;
  const hardMode = flagsData.find((l) => l.difficulty === "hard").data;

  // Get the data and shuffle by level
  switch (level) {
    case 3:
      shuffledData = shuffle(hardMode);
      break;
    case 2:
      shuffledData = shuffle(mediumMode);
      break;
    default:
      shuffledData = shuffle(easyMode);
      break;
  }
}

// Shuffle items in the array
function shuffle(array) {
  const shuffled = array.sort(() => Math.random() - 0.5);

  return shuffled;
}

getFlags("eu-flags.json");

// 1. Get data from json - OK
// 2. Set level by click
// 3. Separate data by level
// 4. Build the card
// 5. Show each data in the card
// 6. Receive the input and check answer
// 7. Message: Right and Wrong
// 8. Put the country in right or wrong result
// 9. Change the card
