// Path to the flags images
const imgPath = "assets/flags/";

// Quiz varaibles
let level = 1; // Game level
let flagsData = []; // List with all flags

// Get the countries in JSON file and initiate game
async function getFlags(file) {
  try {
    const response = await fetch(file);
    const data = await response.json();

    // Assign the JSON result to variable
    flagsData = data.levels;
  } catch (error) {
    console.error("Failed to load flags:", error);
  }
}

getFlags("eu-flags.json");

// 1. Get data from json
// 2. Set level by click
// 3. Separate data by level
// 4. Build the card
// 5. Show each data in the card
// 6. Receive the input and check answer
// 7. Message: Right and Wrong
// 8. Put the country in right or wrong result
// 9. Change the card
