import fs from "node:fs";

const parseFile = () => {
  const file = fs.readFileSync("./day1_input.txt", "utf8");

  // Split file into two arrays of numbers.
  let firstArray = [];
  let secondArray = [];

  file.split("\n").forEach((line) => {
    const parsedLine = line
      .split(" ")
      .filter((num) => num !== "")
      .map((num) => parseInt(num));

    firstArray.push(parsedLine[0]);
    secondArray.push(parsedLine[1]);
  });

  // Sort arrays in ascending order.
  firstArray.sort((a, b) => a - b);
  secondArray.sort((a, b) => a - b);

  return [firstArray, secondArray];
};

/*
  First part of the puzzle.
*/

const calculateDistance = () => {
  const [firstArray, secondArray] = parseFile();

  let distance = 0;

  /*
    Divide each consecutive pair from each other.
    abs(7 - 3) = 4
    abs(3 - 7) = 4
  */

  for (let i = 0; i < firstArray.length; i++) {
    distance += Math.abs(firstArray[i] - secondArray[i]);
  }

  return distance;
};

console.log(`Result of the first half: ${calculateDistance()}`);

/*
  Second part of the puzzle.
*/

const calculateSimilarityScore = () => {
  const [firstArray, secondArray] = parseFile();

  let [comparedIdx, comparedToIdx, occurrence, similarityScore] = [0, 0, 0, 0];

  /*
  Imagine two tapes (here, firstArray and secondArray).

  - If number on left > number on right, then shift right tape up.

    ^
    |
  3 2   ->   3 3
  5 3        5 6
  7 6        7

  - If number on left = number on right, then mark occurence and move to the next number (shift right tape up)

                 ^
                 |
  3 = 3   ->   3 3   ->   3 6
  5   6        5 6        5
  7            7          7

  - If number on left < number on right, then shift left tape up.

  ^
  |
  3 6   ->   5 6
  5          7
  7

  Continue until left tape is gone (array is empty). Up to three tape operations in a single iteration.
*/

  while (comparedIdx < firstArray.length - 1) {
    if (firstArray[comparedIdx] > secondArray[comparedToIdx]) {
      comparedToIdx++;
    }

    if (firstArray[comparedIdx] === secondArray[comparedToIdx]) {
      occurrence++;
      comparedToIdx++;
    }

    if (firstArray[comparedIdx] < secondArray[comparedToIdx]) {
      similarityScore += firstArray[comparedIdx] * occurrence;
      occurrence = 0;
      comparedIdx++;
    }
  }

  return similarityScore;
};

console.log(`Result of the second half: ${calculateSimilarityScore()}`);
