import fs from "node:fs";

/*
  Utils
*/

const parseFile = () => {
  return fs.readFileSync("./day4_input.txt", "utf8").split("\n");
};

/*
  First part of the puzzle.
*/

const findWords = (puzzle) => {
  let occurences = 0;

  const mappedLetters = ["MAS", "AMX"];

  for (let i = 0; i < puzzle.length; i++) {
    // Find indexes of all X and S in a line.
    const X = [...puzzle[i].matchAll(new RegExp(/X/g))].map((a) => a.index);
    const S = [...puzzle[i].matchAll(new RegExp(/S/g))].map((a) => a.index);

    /*
      Check for full matches in a "half-star" pattern:
          X ---> to the right
         /|\
        / | v - diagonally to the right
       /  v - to the bottom
      v - diagonally to the left

      When starting from:
        - X - look for XMAS
        - S - look from SAMX
    */
    [X, S].forEach((matches, matchesIdx) =>
      /*
        X ---> to the right
      */
      matches.forEach((idx) => {
        if (
          idx < puzzle[i].length - 3 &&
          puzzle[i][idx + 1] === mappedLetters[matchesIdx][0]
        ) {
          if (puzzle[i][idx + 2] === mappedLetters[matchesIdx][1]) {
            if (puzzle[i][idx + 3] === mappedLetters[matchesIdx][2]) {
              occurences++;
            }
          }
        }

        /*
          X
           \
            \
             v - diagonally to the right
        */
        if (
          idx < puzzle[i].length - 3 &&
          i < puzzle.length - 3 &&
          puzzle[i + 1][idx + 1] === mappedLetters[matchesIdx][0]
        ) {
          if (puzzle[i + 2][idx + 2] === mappedLetters[matchesIdx][1]) {
            if (puzzle[i + 3][idx + 3] === mappedLetters[matchesIdx][2]) {
              occurences++;
            }
          }
        }

        /*
          X
          |
          |
          v - to the bottom
        */
        if (
          i < puzzle.length - 3 &&
          puzzle[i + 1][idx] === mappedLetters[matchesIdx][0]
        ) {
          if (puzzle[i + 2][idx] === mappedLetters[matchesIdx][1]) {
            if (puzzle[i + 3][idx] === mappedLetters[matchesIdx][2]) {
              occurences++;
            }
          }
        }

        /*
             X
            /
           /
          v - - diagonally to the left
        */
        if (
          idx > 2 &&
          i < puzzle.length - 3 &&
          puzzle[i + 1][idx - 1] === mappedLetters[matchesIdx][0]
        ) {
          if (puzzle[i + 2][idx - 2] === mappedLetters[matchesIdx][1]) {
            if (puzzle[i + 3][idx - 3] === mappedLetters[matchesIdx][2]) {
              occurences++;
            }
          }
        }
      })
    );
  }

  return occurences;
};

console.log(`Result of the first half: ${findWords(parseFile())}`);

/*
  Second part of the puzzle.
*/

const findShapedWords = (puzzle) => {
  let occurences = 0;

  // Add padding to area for out-of-bounds correction.
  for (let i = 1; i < puzzle.length - 1; i++) {
    // Find indexes of all A in a line.
    const A = [...puzzle[i].matchAll(new RegExp(/A/g))].map((a) => a.index);

    /*
      Check for full matches in an X pattern:

        M/S   M/S
          \   /
           \ /
            A
           / \ 
          /   \
        S/M   S/M
    */
    A.forEach((idx) => {
      if (idx === 0 && idx === puzzle[i].length - 1) {
        return;
      }

      /*
         M   x
          \ /
           A
          / \
         x   S
      */
      if (puzzle[i - 1][idx - 1] === "M") {
        if (puzzle[i + 1][idx + 1] === "S") {
          /*
             M   M
              \ /
               A
              / \
             S   S
          */
          if (puzzle[i - 1][idx + 1] === "M") {
            if (puzzle[i + 1][idx - 1] === "S") {
              occurences++;
            }

            /*
             M   S
              \ /
               A
              / \
             M   S
          */
          } else if (puzzle[i - 1][idx + 1] === "S") {
            if (puzzle[i + 1][idx - 1] === "M") {
              occurences++;
            }
          }
        }

        /*
           S   x
            \ /
             A
            / \
           x   M
        */
      } else if (puzzle[i - 1][idx - 1] === "S") {
        if (puzzle[i + 1][idx + 1] === "M") {
          /*
             S   S
              \ /
               A
              / \
             M   M
          */
          if (puzzle[i - 1][idx + 1] === "S") {
            if (puzzle[i + 1][idx - 1] === "M") {
              occurences++;
            }
            /*
             S   M
              \ /
               A
              / \
             S   M
          */
          } else if (puzzle[i - 1][idx + 1] === "M") {
            if (puzzle[i + 1][idx - 1] === "S") {
              occurences++;
            }
          }
        }
      }
    });
  }

  return occurences;
};

console.log(`Result of the second half: ${findShapedWords(parseFile())}`);
