import fs from 'node:fs/promises';

/**
 * Read file
 */
const readFile = async (filePath: string): Promise<string> => {
  const fileContents = await fs.readFile(filePath, {
    encoding: 'utf8',
  });
  const normalizedFileContents = fileContents.trim().split(/\r?\n/).join(''); // Note: Line breaks don't matter, so we single-line
  return normalizedFileContents;
};

/**
 * Calculate sum of multiplications by corrupted memory
 */
const calculateSumOfMultiplicationsByCorruptedMemory = (corruptedMemory: string) => {
  return (
    // Extract all multiplication statements
    [...corruptedMemory.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)]

      // Parse multiplications parameters
      .map((mulMatch) => {
        return mulMatch.slice(1, 3).map((mulParam) => {
          return parseInt(mulParam, 10);
        });
      })

      // Execute multiplication of parameters
      .map((mulParams) => {
        return mulParams.reduce((mulResult, mulParam) => {
          return mulResult * mulParam;
        }, 1);
      })

      // Sum up multiplication results
      .reduce((sum, mulResult) => {
        return sum + mulResult;
      }, 0)
  );
};

/**
 * Part 1: Calculate sum of multiplications
 */
export const calculateSumOfMultiplications = async (corruptedMemoryFilePath: string) => {
  // Get data
  const corruptedMemory = await readFile(corruptedMemoryFilePath);

  // Calculate sum of multiplications
  const sumOfMultiplications = calculateSumOfMultiplicationsByCorruptedMemory(corruptedMemory);

  // Done
  return sumOfMultiplications;
};

/**
 * Part 2: Calculate sum of enabled multiplications
 */
export const calculateSumOfEnabledMultiplications = async (corruptedMemoryFilePath: string) => {
  // Get data
  const corruptedMemory = await readFile(corruptedMemoryFilePath);

  // Calculate sum of enabled multiplications
  const enabledCorruptedMemory =
    // Extract enabled parts of the memory (within "do()" and "don't()", handling edge cases of line start / end)
    [...corruptedMemory.matchAll(/(?:(?:do\(\))|^)(.*?)(?:(?:don't\(\))|$)/g)]
      .map((enabledMatch) => {
        return enabledMatch[0];
      })
      .join('');
  const sumOfEnabledMultiplications = calculateSumOfMultiplicationsByCorruptedMemory(enabledCorruptedMemory);

  // Done
  return sumOfEnabledMultiplications;
};
