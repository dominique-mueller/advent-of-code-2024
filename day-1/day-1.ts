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
 * Parse location ID lists
 */
const parseLocationIdLists = (locationIdListsFileContent: string): [Array<number>, Array<number>] => {
  // Get all location IDs by file line (horizontal)
  const locationIdsPerFileLine = locationIdListsFileContent.split('\n').map((fileContentLine) => {
    return [...fileContentLine.matchAll(/\d+/g)]
      .map((locationIdMatch) => {
        return locationIdMatch[0];
      })
      .map((locationIdAsString) => {
        return parseInt(locationIdAsString, 10);
      });
  });

  // Group location IDs into lists (vertical)
  const locationIdLists: [Array<number>, Array<number>] = [[], []];
  for (let fileLineIndex = 0; fileLineIndex < locationIdsPerFileLine.length; fileLineIndex++) {
    for (let locationIdIndex = 0; locationIdIndex < locationIdsPerFileLine[fileLineIndex].length; locationIdIndex++) {
      locationIdLists[locationIdIndex][fileLineIndex] = locationIdsPerFileLine[fileLineIndex][locationIdIndex];
    }
  }

  // Done
  return locationIdLists;
};

/**
 * Part 1: Calculate total distance
 */
export const calculateTotalDistance = async (locationIdListsFilePath: string) => {
  // Get data
  const locationIdListsFileContent = await readFile(locationIdListsFilePath);
  const locationIdLists = parseLocationIdLists(locationIdListsFileContent);

  // Sort lists
  locationIdLists.forEach((locationList) => {
    locationList.sort(); // Note: Mutates existing array
  });

  // Calculate total distance
  let totalDistance = 0;
  for (let locationIdListIndex = 0; locationIdListIndex < locationIdLists[0].length; locationIdListIndex++) {
    totalDistance += Math.abs(locationIdLists[0][locationIdListIndex] - locationIdLists[1][locationIdListIndex]);
  }

  // Done
  return totalDistance;
};

/**
 * Part 2: Calculate similarity score
 */
export const calculateSimilarityScore = async (locationIdListsFilePath: string) => {
  // Get data
  const locationIdListsFileContent = await readFile(locationIdListsFilePath);
  const locationIdLists = parseLocationIdLists(locationIdListsFileContent);

  // Get similarity score
  let similarityScore = 0;
  for (let locationIdListIndex = 0; locationIdListIndex < locationIdLists[0].length; locationIdListIndex++) {
    let countIdenticalLocationIds = 0;
    for (let secondLocationIdListIndex = 0; secondLocationIdListIndex < locationIdLists[1].length; secondLocationIdListIndex++) {
      if (locationIdLists[1][secondLocationIdListIndex] === locationIdLists[0][locationIdListIndex]) {
        countIdenticalLocationIds++;
      }
    }
    similarityScore += countIdenticalLocationIds * locationIdLists[0][locationIdListIndex];
  }

  // Done
  return similarityScore;
};
