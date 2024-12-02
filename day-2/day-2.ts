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
 * Parse reports
 */
const parseReports = (reportsFileContent: string) => {
  return reportsFileContent.split('\n').map((levelsAsString) => {
    return levelsAsString.split(' ').map((levelAsString) => {
      return parseInt(levelAsString, 10);
    });
  });
};

/**
 * Check whether the given levels are safe
 */
const areLevelsSafe = (levels: Array<number>) => {
  // Calculate difference between each adjacent level
  const levelDifferences: Array<number> = [];
  for (let levelIndex = 0; levelIndex < levels.length - 1; levelIndex++) {
    levelDifferences.push(levels[levelIndex] - levels[levelIndex + 1]);
  }

  // Check whether all level differences are within the safe range
  const safeLevelRange = [1, 3];
  const areLevelDifferencesWithinSafeRange = levelDifferences.every((levelDifference) => {
    return Math.abs(levelDifference) >= safeLevelRange[0] && Math.abs(levelDifference) <= safeLevelRange[1];
  });
  if (!areLevelDifferencesWithinSafeRange) {
    return false; // Early exit
  }

  // Check whether all level differences continue in one direction (increase or decrease)
  const hasAnyPositiveLevelDifferences = levelDifferences.some((levelDiff) => {
    return levelDiff > 0;
  });
  const hasAnyNegativeLevelDifferences = levelDifferences.some((levelDiff) => {
    return levelDiff < 0;
  });
  const doAllLevelsContinueInOneDirection =
    (hasAnyPositiveLevelDifferences && !hasAnyNegativeLevelDifferences) ||
    (hasAnyNegativeLevelDifferences && !hasAnyPositiveLevelDifferences);
  if (!doAllLevelsContinueInOneDirection) {
    return false; // Early exit
  }

  // All good :)
  return true;
};

/**
 * Part 1: Determine number of safe reports
 */
export const determineNumberOfSafeReports = async (reportsFilePath: string) => {
  // Get data
  const reportsFileContent = await readFile(reportsFilePath);
  const reports = parseReports(reportsFileContent);

  // Determine number of safe reports
  const numberOfSafeReports = reports.filter((levels) => {
    return areLevelsSafe(levels);
  }).length;

  // Done
  return numberOfSafeReports;
};

/**
 * Part 2: Determine number of safe reports with problem dampener
 */
export const determineNumberOfSafeReportsWithProblemDampener = async (reportsFilePath: string) => {
  // Get data
  const reportsFileContent = await readFile(reportsFilePath);
  const reports = parseReports(reportsFileContent);

  // Determine number of safe reports with problem dampener
  const numberOfSafeReportsWithProblemDampener = reports.filter((levels) => {
    // Construct levels in all variants (#bruteforce)
    const levelVariants = [levels];
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      levelVariants.push([...levels.slice(0, levelIndex), ...levels.slice(levelIndex + 1)]);
    }

    // Check every variant
    let isAnyLevelVariantSafe = false;
    for (let levelVariantIndex = 0; levelVariantIndex < levelVariants.length; levelVariantIndex++) {
      const isLevelVariantSafe = areLevelsSafe(levelVariants[levelVariantIndex]);
      if (isLevelVariantSafe) {
        isAnyLevelVariantSafe = true;
        break; // Early exit
      }
    }

    // Done
    return isAnyLevelVariantSafe;
  }).length;

  // Done
  return numberOfSafeReportsWithProblemDampener;
};
