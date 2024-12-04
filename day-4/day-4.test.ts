import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { countXMASAppearances, countXShapedMASAppearances } from './day-4';

describe('Day 4: Ceres Search', () => {
  const wordSearchFilePath = path.join(__dirname, 'word-search.txt');

  it('Part 1: should count XMAS appearances', async () => {
    const expectedNumberOfXMASAppearances = 2462; // Verified for this dataset

    const numberOfXMASAppearances = await countXMASAppearances(wordSearchFilePath);

    assert.strictEqual(numberOfXMASAppearances, expectedNumberOfXMASAppearances);
  });

  it('Part 2: should count X-shaped MAS appearances', async () => {
    const expectedNumberOfXShapedMASAppearances = 1877; // Verified for this dataset

    const numberOfXShapedMASAppearances = await countXShapedMASAppearances(wordSearchFilePath);

    assert.strictEqual(numberOfXShapedMASAppearances, expectedNumberOfXShapedMASAppearances);
  });
});
