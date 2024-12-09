import fs from 'node:fs/promises';

/**
 * Read file
 */
const readFile = async (filePath: string): Promise<string> => {
  const fileContents = await fs.readFile(filePath, {
    encoding: 'utf8',
  });
  const normalizedFileContents = fileContents.trim().split(/\r?\n/).join('\n');
  return normalizedFileContents;
};

/**
 * Parse map
 */
const parseMap = (mapFileContent: string): Array<Array<string>> => {
  // Parse map string
  // Note: Sadly, we can only parse out a YX grid immediately
  const mapYX = mapFileContent.split('\n').map((mapLine) => {
    return mapLine.split('');
  });

  // Transform coordinate system from YX into XY (mostly for it to be easier and more understandable to use)
  const mapXY: Array<Array<string>> = [];
  for (let y = 0; y < mapYX.length; y++) {
    for (let x = 0; x < mapYX[y].length; x++) {
      (mapXY[x] ??= [])[y] = mapYX[y][x];
    }
  }

  // Done
  return mapXY;
};

// Parameters
const guardIdentifier = '^';
const obstacleIdentifier = '#';
const walkingDirections: Array<[number, number]> = [
  [0, -1], // up
  [1, 0], // right
  [0, 1], // down
  [-1, 0], // left
];

/**
 * Find current guard position
 */
const findCurrentGuardPosition = (map: Array<Array<string>>): [number, number] => {
  // Find current guard position
  let currentGuardPosition: [number, number] | undefined;
  findGuardLoop: for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (map[x][y] === guardIdentifier) {
        currentGuardPosition = [x, y];
        break findGuardLoop; // Early exit
      }
    }
  }

  // Done
  return currentGuardPosition as [number, number];
};

/**
 * Walk
 */
function* walk(map: Array<Array<string>>, initialPosition: [number, number], initialWalkingDirectionIndex: number) {
  let currentPosition = initialPosition;
  let currentWalkingDirectionIndex = initialWalkingDirectionIndex;
  while (true) {
    // Determine next position
    const nextPosition: [number, number] = [
      currentPosition[0] + walkingDirections[currentWalkingDirectionIndex][0],
      currentPosition[1] + walkingDirections[currentWalkingDirectionIndex][1],
    ];

    // Complete if the next position is outside of the map
    if (map[nextPosition[0]]?.[nextPosition[1]] === undefined) {
      yield { currentPosition, currentWalkingDirectionIndex };
      return; // Exit
    }

    // Turn right without moving if the next position is an obstacle
    if (map[nextPosition[0]]?.[nextPosition[1]] === obstacleIdentifier) {
      currentWalkingDirectionIndex = currentWalkingDirectionIndex === walkingDirections.length - 1 ? 0 : currentWalkingDirectionIndex + 1;
      continue; // Early continue
    }

    // Emit position data
    yield { currentPosition, nextPosition, currentWalkingDirectionIndex };

    // Do walk
    currentPosition = nextPosition;
  }
}

/**
 * Part 1: Determine number of distinct positions visited by guard
 */
export const determineNumberOfDistinctPositionsVisitedByGuard = async (mapFilePath: string) => {
  // Get data
  const updatesFileContent = await readFile(mapFilePath);
  const map = parseMap(updatesFileContent);

  // Walk
  const mapWalker = walk(map, findCurrentGuardPosition(map), 0);
  const mapVisited: Array<Array<boolean>> = [];
  while (true) {
    // Go on ...
    const { value, done } = mapWalker.next();
    if (done) {
      break; // Exit
    }

    // Track visited position
    (mapVisited[value.currentPosition[0]] ??= [])[value.currentPosition[1]] = true;
  }

  // Count visited positions
  let numberOfDistinctPositionsVisitedByGuard = 0;
  for (let x = 0; x < mapVisited.length; x++) {
    for (let y = 0; y < mapVisited[x]?.length; y++) {
      if (mapVisited[x][y] === true) {
        numberOfDistinctPositionsVisitedByGuard++;
      }
    }
  }

  // Done
  return numberOfDistinctPositionsVisitedByGuard;
};

/**
 * Part 2: Determine number of obstacle positions causing a loop
 */
export const determineNumberOfObstaclePositionsCausingALoop = async (mapFilePath: string) => {
  // Get data
  const updatesFileContent = await readFile(mapFilePath);
  const map = parseMap(updatesFileContent);

  // Walk
  const mapWalker = walk(map, findCurrentGuardPosition(map), 0);
  const mapVisited: Array<Array<Array<boolean>>> = [];
  const obstaclePositionsCausingALoop: Array<[number, number]> = [];
  while (true) {
    // Go on ...
    const { value, done } = mapWalker.next();
    if (done) {
      break; // Exit
    }

    // Track visited position
    ((mapVisited[value.currentPosition[0]] ??= [])[value.currentPosition[1]] ??= [])[value.currentWalkingDirectionIndex] = true;

    // Skip simulating an obstacle and checking for loops if
    // - there is no next position (e.g. edge of map)
    // - we have already visited the next position (aka we cannot put an obstacle there)
    if (!value.nextPosition || mapVisited[value.nextPosition[0]]?.[value.nextPosition[1]]) {
      continue; // Early skip
    }

    // Simulate obstacle at next position
    const originalIdentifier = map[value.nextPosition[0]][value.nextPosition[1]];
    map[value.nextPosition[0]][value.nextPosition[1]] = obstacleIdentifier;

    // Walk (again)
    const obstacleLoopTestWalker = walk(map, value.currentPosition, value.currentWalkingDirectionIndex);
    const obstacleLoopTestMapVisited: Array<Array<Array<boolean>>> = [];
    while (true) {
      // Go on ...
      const { value, done } = obstacleLoopTestWalker.next();
      if (done) {
        break; // Exit
      }

      // Check if we have been here before (position & walking direction) -- aka looping
      if (
        mapVisited[value.currentPosition[0]]?.[value.currentPosition[1]]?.[value.currentWalkingDirectionIndex] ||
        obstacleLoopTestMapVisited[value.currentPosition[0]]?.[value.currentPosition[1]]?.[value.currentWalkingDirectionIndex]
      ) {
        obstaclePositionsCausingALoop.push(value.currentPosition);
        break; // Early exit
      }

      // Track visited position
      ((obstacleLoopTestMapVisited[value.currentPosition[0]] ??= [])[value.currentPosition[1]] ??= [])[value.currentWalkingDirectionIndex] =
        true;
    }

    // Revert obstacle simulation
    map[value.nextPosition[0]][value.nextPosition[1]] = originalIdentifier;
  }

  // Done
  return obstaclePositionsCausingALoop.length;
};

/**
 * Part 2 (bruteforce): Determine number of obstacle positions causing a loop
 */
export const determineNumberOfObstaclePositionsCausingALoopBruteforce = async (mapFilePath: string) => {
  // Get data
  const updatesFileContent = await readFile(mapFilePath);
  const map = parseMap(updatesFileContent);

  // Setup walker
  const initialPosition = findCurrentGuardPosition(map);
  const initialWalkingDirectionIndex = 0;

  // Bruteforce obstacles at every valid position
  const obstaclePositionsCausingALoop: Array<[number, number]> = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      // Skip if position is already taken
      if (map[x][y] === obstacleIdentifier || map[x][y] === guardIdentifier) {
        continue;
      }

      // Simulate obstacle
      const originalIdentifier = map[x][y];
      map[x][y] = obstacleIdentifier;

      // Walk
      const mapWalker = walk(map, initialPosition, initialWalkingDirectionIndex);
      const mapVisited: Array<Array<Array<boolean>>> = [];
      while (true) {
        // Go on ...
        const { value, done } = mapWalker.next();
        if (done) {
          break; // Exit
        }

        // Check if we have been here before (position & walking direction) -- aka looping
        if (mapVisited[value.currentPosition[0]]?.[value.currentPosition[1]]?.[value.currentWalkingDirectionIndex]) {
          obstaclePositionsCausingALoop.push(value.currentPosition);
          break;
        }

        // Track visited position
        ((mapVisited[value.currentPosition[0]] ??= [])[value.currentPosition[1]] ??= [])[value.currentWalkingDirectionIndex] = true;
      }

      // Revert obstacle simulation
      map[x][y] = originalIdentifier;
    }
  }

  // Done
  return obstaclePositionsCausingALoop.length;
};
