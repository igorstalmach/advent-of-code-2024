import fs from "node:fs";

/*
  Utils
*/

const parseFile = () => {
  const file = fs.readFileSync("./day2_input.txt", "utf8");

  // Split file into reports.
  return file
    .split("\n")
    .map((line) => line.split(" ").map((num) => parseInt(num)));
};

const MIN_LEVEL_DIFF = 1;
const MAX_LEVEL_DIFF = 3;

/*
  First part of the puzzle.
*/

const checkReports = (reports) => {
  // Assume all reports are initially safe.
  let safeReports = reports.length;

  reports.forEach((report) => {
    const isInitiallyAscending = report[0] - report[1] < 0;

    if (
      !report.every((_, i) => {
        // Out-of-bounds protection
        if (i === report.length - 1) return true;

        const diff = report[i] - report[i + 1];

        return (
          // Check if order is preserved.
          diff < 0 === isInitiallyAscending &&
          // Check if level difference is correct.
          Math.abs(diff) >= MIN_LEVEL_DIFF &&
          Math.abs(diff) <= MAX_LEVEL_DIFF
        );
      })
    ) {
      safeReports--;
    }
  });

  return safeReports;
};

console.log(`Result of the first half: ${checkReports(parseFile())}`);
