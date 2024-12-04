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
 * Parse word search as grid
 */
const parseWordSearchAsGrid = (wordSearchFileContents: string): Array<Array<string>> => {
  // Parse word search string into grid
  // Note: Sadly, we can only parse out a YX grid immediately
  const wordSearchYXGrid = wordSearchFileContents.split('\n').map((wordSearchLine) => {
    return wordSearchLine.split('');
  });

  // Transform YX grid into XY grid (mostly for it to be easier and more understandable to use)
  const wordSearchXYGrid: Array<Array<string>> = [];
  for (let y = 0; y < wordSearchYXGrid.length; y++) {
    for (let x = 0; x < wordSearchYXGrid[y].length; x++) {
      (wordSearchXYGrid[x] ??= [])[y] = wordSearchYXGrid[y][x];
    }
  }

  // Done
  return wordSearchXYGrid;
};

/**
 * Part 1: Count XMAS appearances
 */
export const countXMASAppearances = async (wordSearchFilePath: string) => {
  // Get data
  const wordSearchFileContents = await readFile(wordSearchFilePath);
  const wordSearchGrid = parseWordSearchAsGrid(wordSearchFileContents);

  // Setup search parameters
  const searchTerm = 'XMAS';
  // Setup all search directions (also covers reverse search terms)
  // Note: Coordinate system starts with 0-0 at top left, search directions run clockwise and start at the top
  const searchOffsets: Array<[x: number, y: number]> = [
    [0, -1], // top
    [1, -1], // top-right
    [1, 0], // right
    [1, 1], // bottom-right
    [0, 1], // bottom
    [-1, 1], // bottom-left
    [-1, 0], // left
    [-1, -1], // top-left
  ];

  // Look at each coordinate ...
  const searchTermMatches: Array<Array<[x: number, y: number]>> = [];
  for (let x = 0; x < wordSearchGrid.length; x++) {
    for (let y = 0; y < wordSearchGrid[x].length; y++) {
      // Search into each direction ...
      for (let searchOffsetIndex = 0; searchOffsetIndex < searchOffsets.length; searchOffsetIndex++) {
        // Compare each search term character ...
        const searchTermMatch: Array<[x: number, y: number]> = [];
        for (let searchTermIndex = 0; searchTermIndex < searchTerm.length; searchTermIndex++) {
          // Find current coordinate
          const currentCoordinate: [x: number, y: number] =
            searchTermIndex === 0
              ? // Start with original coordinate for first character
                [x, y]
              : // Continue looking at the next coordinate based on previous match and search offset
                [
                  searchTermMatch[searchTermMatch.length - 1][0] + searchOffsets[searchOffsetIndex][0],
                  searchTermMatch[searchTermMatch.length - 1][1] + searchOffsets[searchOffsetIndex][1],
                ];

          // Get character at coordinate
          // Note: Possibly undefined when going "off grid"
          const currentCharacter: string | undefined = wordSearchGrid[currentCoordinate[0]]?.[currentCoordinate[1]];

          // Check whether the character matches the search term
          if (currentCharacter === searchTerm[searchTermIndex]) {
            searchTermMatch.push(currentCoordinate);
          } else {
            break; // Early exit
          }
        }

        // Accept match if all characters have been found
        if (searchTermMatch.length === searchTerm.length) {
          searchTermMatches.push(searchTermMatch);
        }
      }
    }
  }
  const numberOfSearchTermMatches = searchTermMatches.length;

  // !DEBUG: Print each match
  // for (let matchIndex = 0; matchIndex < searchTermMatches.length; matchIndex++) {
  //   let searchTermResult = '';
  //   for (let coordinateIndex = 0; coordinateIndex < searchTermMatches[matchIndex].length; coordinateIndex++) {
  //     searchTermResult +=
  //       wordSearchGrid[searchTermMatches[matchIndex][coordinateIndex][0]][searchTermMatches[matchIndex][coordinateIndex][1]];
  //   }
  //   console.log(searchTermResult);
  // }

  // Done
  return numberOfSearchTermMatches;
};

/**
 * Part 1: Count X-shaped MAS appearances
 */
export const countXShapedMASAppearances = async (wordSearchFilePath: string) => {
  // Get data
  const wordSearchFileContents = await readFile(wordSearchFilePath);
  const wordSearchGrid = parseWordSearchAsGrid(wordSearchFileContents);

  // Setup search parameters
  const searchTerm = 'MAS';
  // Setup X-shaped search directions (also covers reverse search terms)
  // Note: Coordinate system starts with 0-0 at top left, search directions run clockwise and start at the top-right
  const searchOffsets: Array<[x: number, y: number]> = [
    [1, -1], // top-right
    [1, 1], // bottom-right
    [-1, 1], // bottom-left
    [-1, -1], // top-left
  ];

  // Look at each coordinate ...
  const searchTermMatches: Array<Array<[x: number, y: number]>> = [];
  for (let x = 0; x < wordSearchGrid.length; x++) {
    for (let y = 0; y < wordSearchGrid[x].length; y++) {
      // Search into each direction ...
      const searchTermMatchesForSearchOffsets: Array<Array<[x: number, y: number]>> = [];
      for (let searchOffsetIndex = 0; searchOffsetIndex < searchOffsets.length; searchOffsetIndex++) {
        // Compare each search term character ...
        const searchTermMatch: Array<[x: number, y: number]> = [];
        for (let searchTermIndex = 0; searchTermIndex < searchTerm.length; searchTermIndex++) {
          // Find current coordinate
          const currentCoordinate: [x: number, y: number] =
            searchTermIndex === 0
              ? // Start with search offset coordinate for first character
                [x + searchOffsets[searchOffsetIndex][0], y + searchOffsets[searchOffsetIndex][1]]
              : // Continue looking at the next coordinate based on previous match and reverse search offset
                [
                  searchTermMatch[searchTermMatch.length - 1][0] - searchOffsets[searchOffsetIndex][0],
                  searchTermMatch[searchTermMatch.length - 1][1] - searchOffsets[searchOffsetIndex][1],
                ];

          // Get character at coordinate
          // Note: Possibly undefined when going "off grid"
          const currentCharacter: string | undefined = wordSearchGrid[currentCoordinate[0]]?.[currentCoordinate[1]];

          // Check whether the character matches the search term
          if (currentCharacter === searchTerm[searchTermIndex]) {
            searchTermMatch.push(currentCoordinate);
          } else {
            break; // Early exit
          }
        }

        // Accept match if all characters have been found
        if (searchTermMatch.length === searchTerm.length) {
          searchTermMatchesForSearchOffsets.push(searchTermMatch);
        }
      }

      // Accept match if two matches along the diagonals (X-shape) have been found
      if (searchTermMatchesForSearchOffsets.length === 2) {
        searchTermMatches.push(searchTermMatchesForSearchOffsets.flat(1));
      }
    }
  }
  const numberOfSearchTermMatches = searchTermMatches.length;

  // !DEBUG: Print each match
  // for (let matchIndex = 0; matchIndex < searchTermMatches.length; matchIndex++) {
  //   let searchTermResult = '';
  //   for (let coordinateIndex = 0; coordinateIndex < searchTermMatches[matchIndex].length; coordinateIndex++) {
  //     searchTermResult +=
  //       wordSearchGrid[searchTermMatches[matchIndex][coordinateIndex][0]][searchTermMatches[matchIndex][coordinateIndex][1]];
  //   }
  //   console.log(searchTermResult);
  // }

  // Done
  return numberOfSearchTermMatches;
};
