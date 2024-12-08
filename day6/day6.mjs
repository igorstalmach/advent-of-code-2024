import fs from "node:fs";

/*
  Utils
*/

const parseFile = () =>
  fs
    .readFileSync("./day6_input.txt", "utf8")
    .split("\n")
    .map((line) => line.split(""));

const findGuard = (map) => {
  for (let i = 0; i < map.length; i++) {
    const guard = map[i].find((position) =>
      ["^", ">", "v", "<"].includes(position)
    );

    if (guard) {
      const guardPosition = map[i].indexOf(guard);
      return [guardPosition, i];
    }
  }
};

/*
  First part of the puzzle.
*/

const calculateDistinctPositions = (map) => {
  let position = findGuard(map);
  let steps = 0;
  let guardState = map[position[1]][position[0]];

  const updateSteps = () => {
    if (map[position[1]][position[0]] !== "X") {
      map[position[1]][position[0]] = "X";
      steps++;
    }
  };

  while (true) {
    switch (guardState) {
      case "^":
        if (map[position[1] - 1] && map[position[1] - 1][position[0]]) {
          if (map[position[1] - 1][position[0]] === "#") {
            guardState = ">";
          } else {
            updateSteps();
            position[1]--;
            guardState = "^";
          }
        } else {
          return ++steps;
        }
        break;
      case ">":
        if (map[position[1]] && map[position[1]][position[0] + 1]) {
          if (map[position[1]][position[0] + 1] === "#") {
            guardState = "v";
          } else {
            updateSteps();
            position[0]++;
            guardState = ">";
          }
        } else {
          return ++steps;
        }
        break;
      case "v":
        if (map[position[1] + 1] && map[position[1] + 1][position[0]]) {
          if (map[position[1] + 1][position[0]] === "#") {
            guardState = "<";
          } else {
            updateSteps();
            position[1]++;
            guardState = "v";
          }
        } else {
          return ++steps;
        }
        break;
      case "<":
        if (map[position[1]] && map[position[1]][position[0] - 1]) {
          if (map[position[1]][position[0] - 1] === "#") {
            guardState = "^";
          } else {
            updateSteps();
            position[0]--;
            guardState = "<";
          }
        } else {
          return ++steps;
        }
        break;
      default:
        return steps;
    }
  }
};

console.log(
  `Result of the first half: ${calculateDistinctPositions(parseFile())}`
);
