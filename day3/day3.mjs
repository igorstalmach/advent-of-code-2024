import fs from "node:fs";

/*
  Utils
*/

const parseFile = () => {
  return fs.readFileSync("./day3_input.txt", "utf8").split("\n").join();
};

/*
  First part of the puzzle.
*/

const parseMemory = (memory) =>
  /*
    Steps:
    1. Find all instructions.
    2. Extract numbers from instruction.
    3. Multiply numbers and add to previous products.
  */
  memory.match(new RegExp(/mul\(\d+,\d+\)/g)).reduce((acc, fragment) => {
    const instruction = fragment.match(new RegExp(/\d+/g));
    return acc + instruction[0] * instruction[1];
  }, 0);

console.log(`Result of the first half: ${parseMemory(parseFile())}`);

/*
  Second part of the puzzle.
*/

const parseEnhancedMemory = (memory) => {
  let isEnabled = true;

  return (
    memory
      // Find all relevant instructions.
      .match(new RegExp(/(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g))
      .filter((fragment) => {
        // Enable instructions if 'do()', do not enable if 'don't()'.
        if (fragment === "do()") {
          isEnabled = true;
          return;
        } else if (fragment === "don't()") {
          isEnabled = false;
          return;
        }

        // Return instructions only when enabled.
        if (isEnabled) {
          return fragment;
        }
      })
      // Extract numbers from relevant instructions.
      // Multiply numbers and add to previous products.
      .reduce((acc, fragment) => {
        const instruction = fragment.match(new RegExp(/\d+/g));
        return acc + instruction[0] * instruction[1];
      }, 0)
  );
};

console.log(`Result of the second half: ${parseEnhancedMemory(parseFile())}`);
