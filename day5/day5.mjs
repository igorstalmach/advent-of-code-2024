import fs from "node:fs";

/*
  Utils
*/

const parseFile = () => {
  const file = fs.readFileSync("./day5_input.txt", "utf8").split("\n");

  // Split into "rules" and "updates".
  const sliceIndex = file.indexOf("");
  return [
    file.slice(0, sliceIndex),
    file.slice(sliceIndex + 1, file.length).map((update) => update.split(",")),
  ];
};

const buildRulesMap = (rules) => {
  const mappedRules = {};

  // Group pages that should appear first with all pages that should appear after.
  rules.forEach((rule) => {
    const [firstPage, latterPage] = rule.split("|");

    if (firstPage in mappedRules) {
      mappedRules[firstPage].push(latterPage);
    } else {
      mappedRules[firstPage] = [latterPage];
    }
  });

  return mappedRules;
};

/*
  First part of the puzzle.
*/

const getSumOfCorrectMiddlePages = (rules, updates) => {
  const mappedRules = buildRulesMap(rules);

  let correctMiddlePagesSum = 0;

  updates.forEach((update) => {
    // Check if all rules are compatible with the update.
    const allRulesMet = update.every((firstPage, firstPageIdx) => {
      const latterPages = mappedRules[firstPage];
      // Correct when rule is not found (page is ignored).
      if (!latterPages) return true;
      // Compare index of all latter pages.
      // Each should be either not found or after current page.
      return latterPages.every(
        (latterPage) =>
          update.indexOf(latterPage) === -1 ||
          firstPageIdx < update.indexOf(latterPage)
      );
    });

    // Add middle page value of a correct update.
    if (allRulesMet) {
      correctMiddlePagesSum += Number(update[Math.floor(update.length / 2)]);
    }
  });

  return correctMiddlePagesSum;
};

console.log(
  `Result of the first half: ${getSumOfCorrectMiddlePages(...parseFile())}`
);

/*
  Second part of the puzzle.
*/

const getSumOfCorrectedMiddlePages = (rules, updates) => {
  const mappedRules = buildRulesMap(rules);
  let correctedMiddlePagesSum = 0;

  updates.forEach((update) => {
    let isErrorFound = false;
    let currentIdx = 0;

    // Check every page in update.
    while (currentIdx < update.length) {
      const latterPages = mappedRules[update[currentIdx]];
      // Correct when rule is not found (page is ignored).
      if (!latterPages) {
        currentIdx++;
        continue;
      }

      let earliestIdxToRecheck = currentIdx;
      // Compare index off all latter pages.
      latterPages.forEach((latterPage) => {
        const latterPageIdxInUpdate = update.indexOf(latterPage);

        // Move incorrect page AFTER current page.
        // Ignore if not found, or already after current page.
        if (
          latterPageIdxInUpdate !== -1 &&
          currentIdx > latterPageIdxInUpdate
        ) {
          update.splice(
            currentIdx,
            0,
            ...update.splice(latterPageIdxInUpdate, 1)
          );
          isErrorFound = true;

          // Recheck previous pages if order was updated.
          // Fixing this page compatibility might break previously checked ones.
          // Start from the earliest updated page.
          if (latterPageIdxInUpdate < earliestIdxToRecheck) {
            earliestIdxToRecheck = latterPageIdxInUpdate;
          }
        }
      });

      // Update currently checked page if recheck is needed.
      if (earliestIdxToRecheck !== currentIdx) {
        currentIdx = earliestIdxToRecheck;
      } else {
        currentIdx++;
      }
    }

    // Add middle page value of a corrected update.
    if (isErrorFound) {
      correctedMiddlePagesSum += Number(update[Math.floor(update.length / 2)]);
    }
  });

  return correctedMiddlePagesSum;
};

console.log(
  `Result of the second half: ${getSumOfCorrectedMiddlePages(...parseFile())}`
);
